"use client";

import { Button, Card, CardBody, Image, Slider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addCollector,
  formatDate,
  formatUnixTimestampToDate,
  getBlogNFTCollectionAddress,
  INewBlogCard,
  statusText,
  updateBlogNFTCollectionAddress,
} from "@/app/api";
import ReadTipTap from "../tiptap/readtiptap";
import { useRouter } from "next/navigation";
import { useDraftBlogInfo } from "@/provider/DraftBlogProvider";
import { createNftCollection } from "@/utils/createnftcollection";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintNft } from "@/utils/createnft";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { useAppContext } from "@/provider/AppProvider";
import useProgram from "@/app/anchor/config";
import { PublicKey } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack, faHeart } from "@fortawesome/free-solid-svg-icons";

interface VoteInfo {
  status: number; // 1 = upvote, 2 = downvote
}

const BlogCard = (props: INewBlogCard) => {
  const [liked, setLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track mount state
  const [writerProfile, setWriterProfile] = useState<any>({});
  const [myVoteInfo, setVoteInfo] = useState<VoteInfo>({ status: 0 });
  const [transactionPending, setTransactionPending] = useState(false);

  const { setDraftBlogInfo } = useDraftBlogInfo();
  const { userInfo } = useUserInfo();
  const { setLoading } = useAppContext();

  const wallet = useWallet();

  const router = useRouter();

  const program = useProgram();

  useEffect(() => {
    getWriterInfo();
  }, []);

  const getWriterInfo = async () => {
    try {
      const tempPubKey = new PublicKey(props.walletaddress);

      if (program) {
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), tempPubKey.toBuffer()],
          program.programId
        );
        const userProfile = await program.account.userProfile.fetch(userPda);
        const formattedBlogs = {
          avatar: userProfile.avatar,
          username: userProfile.username,
          walletaddress: userProfile.walletaddress,
          createAt: userProfile.createdAt,
        };
        setWriterProfile(formattedBlogs);
      }
    } catch (error) {
      console.log("getWriterInfo", error);
    }
  };

  const handleRouter = () => {
    if (props.status) {
      router.push(`/blog/${props._id}`);
    } else {
      setDraftBlogInfo(props);
      router.push(`/blog/new/${props._id}`);
    }
  };

  const fetchNFTCollectionAddress = async (
    blogId: string
  ): Promise<string | null> => {
    const nftCollectionAddress = await getBlogNFTCollectionAddress(blogId);

    if (nftCollectionAddress) {
      console.log("NFT Collection Address:", nftCollectionAddress);
      return nftCollectionAddress;
    } else {
      console.log("Failed to fetch NFT Collection Address.");
      return null;
    }
  };

  const updateNFTCollectionAddress = async (
    blogId: string,
    nftCollectionAddress: any
  ) => {
    if (!blogId || !nftCollectionAddress) {
      console.log("Blog ID and NFT Collection Address are required.");
      return;
    }

    const success = await updateBlogNFTCollectionAddress(
      blogId,
      nftCollectionAddress
    );

    if (success) {
      console.log("NFT collection address updated successfully.");
      return true;
    } else {
      console.log("Failed to update NFT collection address.");
      return false;
    }
  };

  const onClickCardBtn = async () => {
    if (props.status) {
      setLoading(true);
      let collectionAddress = await fetchNFTCollectionAddress(props._id);
      const maxSymbolLength = 10;
      console.log("collectionAddress", collectionAddress);
      if (!collectionAddress) {
        console.log("collectionAddress", collectionAddress);
        const collectionData = {
          name: props.title,
          symbol: props.title.replace(/\s+/g, "").substring(0, maxSymbolLength),
          description: window.location.href,
          image: props.coverimage,
        };
        collectionAddress = await createNftCollection(collectionData, wallet);
        console.log("createNftCollection collectionAddress", collectionAddress);
      }
      if (collectionAddress) {
        const updateResult = await updateNFTCollectionAddress(
          props._id,
          collectionAddress
        );
        if (updateResult) {
          const nftData = {
            name: `${props.title}0`,
            symbol: props.title
              .replace(/\s+/g, "")
              .substring(0, maxSymbolLength),
            description: window.location.href,
            image: props.coverimage,
          };
          const mintAddress = await mintNft(nftData, wallet, collectionAddress);
          if (mintAddress) {
            const newCollector = {
              avatar: userInfo?.avatar,
              username: userInfo?.username,
              walletaddress: userInfo?.walletaddress,
              nftMintAddress: mintAddress,
            };
            const result = await addCollector(props._id, newCollector);
          }
        }
      }
    } else {
    }
    setLoading(false);
  };

  // Function to create Vote Info (if it doesn't exist)
  const createVoteInfo = async (voteStatus: number = 0) => {
    if (program) {
      try {
        setTransactionPending(true);
        console.log("createVoteInfo start: " + voteStatus);

        const blogPdaPublicKey = new PublicKey(props._id);
        const ownerPublicKey = new PublicKey(userInfo?.walletaddress);
        const [votePda] = findProgramAddressSync(
          [
            utf8.encode("vote"),
            blogPdaPublicKey.toBuffer(),
            ownerPublicKey.toBuffer(),
          ],
          program.programId
        );

        const tx = await program.methods
          .addVote(voteStatus)
          .accounts({
            postAccount: blogPdaPublicKey,
            voteInfo: votePda,
            voter: ownerPublicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();

        console.log(`Transaction successful: ${tx}`);
        setTransactionPending(false);

        // Set the vote info after creation (initialize status)
        setVoteInfo({ status: voteStatus }); // This sets the status based on what was just created
        return true;
      } catch (error) {
        console.log("Error creating vote account:", error);
        setTransactionPending(false);
        return false;
      }
    }
    return false;
  };

  // Function to fetch Vote Info
  const fetchVoteInfo = async () => {
    if (program) {
      const blogPdaPublicKey = new PublicKey(props._id);

      const blogdata = await program.account.blogPost.fetch(blogPdaPublicKey);

      console.log("fetchVoteInfo blogdata:", blogdata, blogPdaPublicKey);
      const ownerPublicKey = new PublicKey(userInfo?.walletaddress);
      const [votePda] = findProgramAddressSync(
        [
          utf8.encode("vote"),
          blogPdaPublicKey.toBuffer(),
          ownerPublicKey.toBuffer(),
        ],
        program.programId
      );

      try {
        const voteInfo = await program.account.voteInfo.fetch(votePda);
        console.log("fetchVoteInfo: ", voteInfo);
        return voteInfo;
      } catch (error) {
        console.log("Error fetching vote info:", error);
        return null;
      }
    }
    return null;
  };

  // Function to edit Vote Status
  const editVoteStatus = async (newStatus: number) => {
    if (program && !transactionPending) {
      setTransactionPending(true);

      const blogPdaPublicKey = new PublicKey(props._id);
      const ownerPublicKey = new PublicKey(userInfo?.walletaddress);
      const [votePda] = findProgramAddressSync(
        [
          utf8.encode("vote"),
          blogPdaPublicKey.toBuffer(),
          ownerPublicKey.toBuffer(),
        ],
        program.programId
      );

      try {
        const voteInfo = await fetchVoteInfo();

        if (voteInfo) {
          // If vote info exists and needs to be updated
          if (voteInfo.status !== newStatus) {
            const tx = await program.methods
              .editVote(newStatus)
              .accounts({
                postAccount: blogPdaPublicKey,
                voteInfo: votePda,
                voter: ownerPublicKey,
              })
              .rpc();

            console.log(`Transaction successful: ${tx}`);
            setVoteInfo({ status: newStatus }); // Set the new status in myVoteInfo
          }
        } else {
          console.log("Vote info does not exist. Creating...");
          // If vote info doesn't exist, create it with the new status
          await createVoteInfo(newStatus);
        }

        setTransactionPending(false);
      } catch (error) {
        console.log("Error handling vote status:", error);
        setTransactionPending(false);
      }
    }
  };

  // Function to handle Upvote click
  const onClickUpvote = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling

    console.log("onClickUpvote: " + myVoteInfo.status);
    // Only proceed if the current status is not already upvote
    if (myVoteInfo.status !== 1) {
      const newStatus =
        myVoteInfo.status === 0 || myVoteInfo.status === 2
          ? 1
          : myVoteInfo.status;

      // Call the function to edit the vote status
      await editVoteStatus(newStatus);
    }
  };

  // Function to handle Downvote click
  const onClickDownvote = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling

    console.log("onClickDownvote: " + myVoteInfo.status);
    // Only proceed if the current status is not already downvote
    if (myVoteInfo.status !== 2) {
      const newStatus =
        myVoteInfo.status === 0 || myVoteInfo.status === 1
          ? 2
          : myVoteInfo.status;

      // Call the function to edit the vote status
      await editVoteStatus(newStatus);
    }
  };
  return (
    <Card
      isBlurred
      className="bg-background/60 dark:bg-default-100/50 shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] mx-2 my-4 border-none rounded-lg w-full h-[360px] 2xl:h-[400px]"
      shadow="sm"
    >
      <CardBody className="p-0">
        <div className="flex flex-col justify-between items-center gap-5 w-full h-full">
          <div className="relative w-full cursor-pointer">
            <Image
              alt={props.title}
              className="aspect-[2/1] object-cover"
              height="50%"
              shadow="md"
              src={`${
                props.coverimage
                  ? props.coverimage
                  : "/assets/image/article/sui-network.webp"
              }`}
              width="100%"
              onClick={handleRouter}
              radius="none"
            />
          </div>
          <div className="flex justify-between items-center gap-2 px-5 w-full">
            <Link
              href={`/profile/${writerProfile?.walletaddress}`}
              className="flex items-center gap-2"
            >
              <Image
                alt={writerProfile?.username}
                className="rounded-full object-cover"
                height={20}
                shadow="md"
                src={`${writerProfile?.avatar}`}
                width="20"
              />
              <p className="text-sm">{writerProfile?.username}</p>
              <p className="text-black text-sm text-opacity-50">
                {formatUnixTimestampToDate(props.createdAt)}
              </p>
            </Link>
          </div>

          <div className="flex flex-col flex-1 items-center px-5 w-full overflow-hidden">
            <div className="flex justify-center items-start">
              <div
                className="flex flex-col gap-0 font-medium text-xl cursor-pointer"
                onClick={handleRouter}
              >
                {props.title}
              </div>
            </div>
            <div className="flex flex-1 items-start w-full overflow-hidden">
              <div className="flex flex-col gap-0 w-full overflow-hidden">
                <ReadTipTap content={props.content} />
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-3 px-5 w-full">
            <div className="flex justify-between items-center mt-4 w-full">
              <div className="flex justify-between items-center gap-2 w-full">
                {/* <Link
                  href={`/profile/${writerProfile?.walletaddress}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    alt={writerProfile?.username}
                    className="rounded-full object-cover"
                    height={40}
                    shadow="md"
                    src={`${writerProfile?.avatar}`}
                    width="40"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm">{writerProfile?.username}</p>
                    <p className="text-black text-sm text-opacity-50">
                      {formatUnixTimestampToDate(props.createdAt)}
                    </p>
                  </div>
                </Link> */}

                <div className="flex flex-row items-center gap-5">
                  <div
                    onClick={(event) => onClickUpvote(event)}
                    className="flex flex-row items-center gap-1 cursor-pointer"
                  >
                    <svg
                      fill="currentColor"
                      height="20"
                      icon-name="upvote-outline"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {" "}
                      <path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"></path>
                    </svg>
                    <div>{props?.upvote}</div>
                    {/* <FontAwesomeIcon
                      // @ts-ignore
                      icon={faHeart}
                    />{" "}
                    {props?.upvote} */}
                  </div>
                  <div
                    onClick={(event) => onClickDownvote(event)}
                    className="flex flex-row items-center gap-1 cursor-pointer"
                  >
                    <svg
                      fill="currentColor"
                      height="20"
                      icon-name="downvote-outline"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"></path>
                    </svg>
                    <div>{props?.downvote}</div>
                    {/* <FontAwesomeIcon icon={faHeartCrack} /> {props?.downvote} */}
                  </div>
                </div>

                <Button
                  radius="full"
                  className="bg-gradient-to-tr from-purple-700 to-blue-700 shadow-lg text-white"
                  onClick={onClickCardBtn}
                  size="sm"
                >
                  {statusText[props.status]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BlogCard;
