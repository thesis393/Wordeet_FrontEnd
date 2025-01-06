"use client";

import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  Image,
  Slider,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addCollector,
  formatDate,
  formatUnixTimestampToDate,
  getBlogNFTCollectionAddress,
  getDataFromIrys,
  INewBlogCard,
  statusText,
  updateBlogNFTCollectionAddress,
} from "@/app/api";
import ReadTipTap from "../tiptap/readtiptap";
import { useAppContext } from "@/provider/AppProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { createNftCollection } from "@/utils/createnftcollection";
import { mintNft } from "@/utils/createnft";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { useRouter } from "next/navigation";
import { useDraftBlogInfo } from "@/provider/DraftBlogProvider";
import useProgram from "@/app/anchor/config";
import { PublicKey } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { publicKey } from "@metaplex-foundation/umi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/fontawesome-free-solid";
import { library, IconProp } from "@fortawesome/fontawesome-svg-core";
interface VoteInfo {
  status: number; // 1 = upvote, 2 = downvote
}
const TrendBlogCard = (props: INewBlogCard) => {
  const [liked, setLiked] = useState(false);

  const { setLoading } = useAppContext();
  const wallet = useWallet();
  const { userInfo } = useUserInfo();
  const { setDraftBlogInfo } = useDraftBlogInfo();
  const program = useProgram();
  const [writerProfile, setWriterProfile] = useState<any>({});
  const [myVoteInfo, setVoteInfo] = useState<VoteInfo>({ status: 0 });
  const [collectorInfo, setCollectorInfo] = useState<any[]>([]);
  const [transactionPending, setTransactionPending] = useState(false);

  useEffect(() => {
    getWriterInfo();
    getCollectorInfo();
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

  const getCollectorInfo = async () => {
    try {
      if (program) {
        const allCollector = await program.account.collectorInfo.all();

        const formattedCollector = allCollector.map(
          ({ publicKey, account }) => ({
            _id: publicKey.toString(),
            blogPost: account.blogPost,
            collector: account.collector,
            username: account.username,
            avatar: account.avatar,
            walletaddress: account.walletaddress,
            nftMintAddress: account.nftMintAddress,
            createdAt: account.createdAt,
          })
        );

        const filteredCollector = formattedCollector
          .filter((collector) => collector.blogPost.toString() == props._id)
          .sort((a, b) => a.createdAt - b.createdAt);
        setCollectorInfo(filteredCollector);

        console.log(
          "getCollectorInfo success: ",
          formattedCollector,
          collectorInfo
        );
      }
    } catch (error) {
      console.log("getCollectorInfo", error);
    }
  };

  //Backend way
  // const fetchNFTCollectionAddress = async (
  //   blogId: string
  // ): Promise<string | null> => {
  //   const nftCollectionAddress = await getBlogNFTCollectionAddress(blogId);
  //
  //   if (nftCollectionAddress) {
  //     console.log("NFT Collection Address:", nftCollectionAddress);
  //     return nftCollectionAddress;
  //   } else {
  //     console.log("Failed to fetch NFT Collection Address.");
  //     return null;
  //   }
  // };

  // const updateNFTCollectionAddress = async (
  //   blogId: string,
  //   nftCollectionAddress: any
  // ) => {
  //   if (!blogId || !nftCollectionAddress) {
  //     console.log("Blog ID and NFT Collection Address are required.");
  //     return;
  //   }

  //   const success = await updateBlogNFTCollectionAddress(
  //     blogId,
  //     nftCollectionAddress
  //   );

  //   if (success) {
  //     console.log("NFT collection address updated successfully.");
  //     return true;
  //   } else {
  //     console.log("Failed to update NFT collection address.");
  //     return false;
  //   }
  // };

  const fetchNFTCollectionAddress = async (
    blogId: string
  ): Promise<string | null> => {
    if (blogId !== undefined && program) {
      try {
        const pdaPublicKey = new PublicKey(blogId);
        const aBlog = await program.account.blogPost.fetch(pdaPublicKey);

        if (aBlog) {
          const irysResponse = await getDataFromIrys(`${aBlog.content}`);
          const content = irysResponse?.data?.content || aBlog.content; // Use fetched content or fallback to original

          // Map blog data to formatted posts
          const formattedBlog = {
            _id: blogId,
            owner: aBlog.owner.toString(),
            username: aBlog.username,
            coverimage: aBlog.coverimage,
            category: aBlog.category,
            createdAt: aBlog.createdAt,
            title: aBlog.title,
            content,
            upvote: aBlog.upvote,
            downvote: aBlog.downvote,
            keywords: aBlog.keywords,
            walletaddress: aBlog.walletaddress,
            nftcollectionaddress: aBlog.nftcollectionaddress,
            ntotalcollector: aBlog.ntotalcollecter,
            status: 1,
            lowercaseTitle: aBlog.title.replace(/\s+/g, "-").toLowerCase(),
          };
          console.log("User get blog", formattedBlog);
          if (formattedBlog.nftcollectionaddress) {
            console.log(
              "NFT Collection Address:",
              formattedBlog.nftcollectionaddress
            );
            return formattedBlog.nftcollectionaddress;
          } else {
            console.log("Failed to fetch NFT Collection Address.");
            return null;
          }
        } else {
          return null;
        }
      } catch (error) {
        console.log("Error get blog", error);
        return null;
      }
    } else {
      return null;
    }
  };

  const updateNFTCollectionAddress = async (
    blogId: string,
    nftCollectionAddress: any,
    blogData: any
  ) => {
    console.log(
      `updateNFTCollectionAddress input param blogId: ${blogId}, nftCollectionAddress: ${nftCollectionAddress}, blogData: ${blogData}`
    );
    if (!blogId || !nftCollectionAddress || !blogData) {
      return false;
    }
    if (program) {
      try {
        const pdaPublicKey = new PublicKey(blogId);
        const ownerPublicKey = new PublicKey(blogData.walletaddress);

        await program.methods
          .editBlogNftcollectionaddress(nftCollectionAddress)
          .accounts({
            blogPost: pdaPublicKey,
            owner: ownerPublicKey,
          })
          .rpc();
        return true;
      } catch (error) {
        console.log("updateNFTCollectionAddress get error: ", error);
        return false;
      }
    }
    return false;
  };

  const sleep = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const addCollectorInfo = async (
    blogId: string,
    newCollector: any,
    blogData: any
  ) => {
    if (!blogId || !newCollector || !blogData) {
      console.log(
        `addCollectorInfo input param error. blogId: ${blogId}, newCollector: ${newCollector}, blogData: ${blogData}`
      );
      return false;
    }

    if (program) {
      try {
        const blogPublicKey = new PublicKey(blogId);
        const ownerPublicKey = new PublicKey(newCollector.walletaddress);

        const [collectorPda] = findProgramAddressSync(
          [
            utf8.encode("collector"),
            blogPublicKey.toBuffer(),
            Uint8Array.from([blogData.ntotalcollector]),
          ],
          program.programId
        );
        console.log("ntotalcollector =" + blogData.ntotalcollector);
        console.log("collectorPda =" + collectorPda);
        console.log("collector =" + ownerPublicKey);
        console.log("postAccount =" + blogPublicKey);

        await program.methods
          .addCollector(
            newCollector.username,
            newCollector.avatar,
            newCollector.walletaddress,
            newCollector.nftMintAddress
          )
          .accounts({
            postAccount: blogPublicKey,
            collectorInfo: collectorPda,
            collector: ownerPublicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();
        console.log("addCollectorInfo success");
        return true;
      } catch (error) {
        console.log("addCollectorInfo get error: ", error);
        return false;
      }
    }
    return false;
  };

  const collectBlog = async (
    blogData: any,
    wallet: WalletContextState,
    locationHref: string
  ) => {
    let collectionAddress = await fetchNFTCollectionAddress(blogData._id);
    const maxSymbolLength = 10;
    let updateResult = true;
    console.log("collectionAddress", collectionAddress);
    if (!collectionAddress) {
      console.log("collectionAddress", collectionAddress);
      const collectionData = {
        name: blogData.title,
        symbol: blogData.title
          .replace(/\s+/g, "")
          .substring(0, maxSymbolLength),
        description: locationHref,
        image: blogData.coverimage,
      };
      collectionAddress = await createNftCollection(collectionData, wallet);
      console.log("createNftCollection collectionAddress", collectionAddress);

      updateResult = await updateNFTCollectionAddress(
        blogData._id,
        collectionAddress,
        blogData
      );
    }
    if (collectionAddress && updateResult) {
      const nftData = {
        name: `${blogData.title}0`,
        symbol: blogData.title
          .replace(/\s+/g, "")
          .substring(0, maxSymbolLength),
        description: window.location.href,
        image: blogData.coverimage,
      };

      const mintAddress = await mintNft(nftData, wallet, collectionAddress);
      if (mintAddress) {
        console.log("collectBlog mintAddress: ", mintAddress);
        const newCollector = {
          avatar: userInfo?.avatar,
          username: userInfo?.username,
          walletaddress: userInfo?.walletaddress,
          nftMintAddress: mintAddress,
        };
        const result = await addCollectorInfo(
          blogData._id,
          newCollector,
          blogData
        );
      }
    }
  };

  const onClickCardBtn = async () => {
    if (props.status) {
      await collectBlog(props, wallet, window.location.href);

      //Backend Way
      //   setLoading(true);
      //   let collectionAddress = await fetchNFTCollectionAddress(props._id);
      //   const maxSymbolLength = 10;
      //   console.log("collectionAddress", collectionAddress);
      //   if (!collectionAddress) {
      //     console.log("collectionAddress", collectionAddress);
      //     const collectionData = {
      //       name: props.title,
      //       symbol: props.title.replace(/\s+/g, "").substring(0, maxSymbolLength),
      //       description: window.location.href,
      //       image: props.coverimage,
      //     };
      //     collectionAddress = await createNftCollection(collectionData, wallet);
      //     console.log("createNftCollection collectionAddress", collectionAddress);
      //   }
      //   if (collectionAddress) {
      //     const updateResult = await updateNFTCollectionAddress(
      //       props._id,
      //       collectionAddress
      //     );
      //     if (updateResult) {
      //       const nftData = {
      //         name: `${props.title}0`,
      //         symbol: props.title
      //           .replace(/\s+/g, "")
      //           .substring(0, maxSymbolLength),
      //         description: window.location.href,
      //         image: props.coverimage,
      //       };
      //       const mintAddress = await mintNft(nftData, wallet, collectionAddress);
      //       if (mintAddress) {
      //         const newCollector = {
      //           avatar: userInfo?.avatar,
      //           username: userInfo?.username,
      //           walletaddress: userInfo?.walletaddress,
      //           nftMintAddress: mintAddress,
      //         };
      //         const result = await addCollector(props._id, newCollector);
      //       }
      //     }
      //   }
    }
    // setLoading(false);
  };

  const router = useRouter();
  const handleRouter = () => {
    if (props.status) {
      router.push(`/blog/${props._id}`);
    } else {
      setDraftBlogInfo(props);
      router.push(`/blog/new/${props._id}`);
    }
  };
  const onClickCollector = (walletAddress: any, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`Clicked collector with wallet: ${walletAddress}`);
    if (walletAddress) {
      router.push(`/profile/${walletAddress}`);
    }
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
    <div
      className="border-none rounded-lg w-full h-full cursor-pointer"
      onClick={handleRouter}
    >
      <div className="flex md:flex-row flex-col justify-between gap-5 w-full h-full">
        <div className="flex-shrink-0 h-full basis-1/2">
          <Image
            alt={props.title}
            className="h-full aspect-[4/3] object-cover"
            height="100%"
            shadow="md"
            src={`${
              props.coverimage
                ? props.coverimage
                : "/assets/image/article/sui-network.webp"
            }`}
            width="100%"
            radius="none"
          />
        </div>
        <div className="relative flex flex-col flex-shrink-0 justify-between gap-3 px-5 py-5 line-break-anywhere basis-1/2">
          <div className="flex justify-between items-center gap-2 w-full">
            <div
              onClick={(event) =>
                onClickCollector(writerProfile.walletaddress, event)
              }
              className="flex items-center gap-2"
            >
              <Image
                alt={writerProfile.username}
                className="rounded-full object-cover"
                height={20}
                shadow="md"
                src={`${writerProfile.avatar}`}
                width="20"
              />
              <p className="text-sm">{writerProfile.username}</p>
              <p className="text-black text-sm text-opacity-50">
                {formatUnixTimestampToDate(props.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-1 items-center w-full h-full overflow-hidden basis-2/3">
            <div className="flex items-start px-2 w-full">
              <div className="flex flex-col gap-0 font-medium text-xl break-all cursor-pointer">
                {props.title}
              </div>
            </div>
            <div className="flex flex-1 items-start w-full overflow-hidden">
              <div className="flex flex-col gap-0 w-full max-h-[150px] overflow-hidden read-only">
                <ReadTipTap content={props.content} />
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-5 basis-1/6">
            <AvatarGroup
              isBordered
              max={5}
              total={props?.ntotalcollector}
              renderCount={(count) => (
                <p className="font-medium text-foreground text-small ms-2">
                  {count} Collected
                </p>
              )}
            >
              {collectorInfo?.map((item: any, idx: number) => (
                // <Link href={`/profile/${item.walletaddress}`} key={idx}>
                <Avatar
                  src={item?.avatar}
                  size="sm"
                  onClick={(event) =>
                    onClickCollector(item?.walletaddress, event)
                  }
                  key={idx}
                />
                // </Link>
              ))}
            </AvatarGroup>
          </div>
          <div className="flex flex-col pr-5 w-full bais-1/6">
            <div className="flex justify-between items-center gap-2 w-full">
              <Button
                radius="full"
                className="bg-gradient-to-tr from-purple-700 to-blue-700 shadow-lg text-white"
                onClick={onClickCardBtn}
                size="sm"
              >
                {statusText[props.status]}
              </Button>
              <div className="flex flex-row gap-5">
                <div onClick={(event) => onClickUpvote(event)}>
                  <FontAwesomeIcon icon={faHeart} /> {props?.upvote}
                </div>
                <div onClick={(event) => onClickDownvote(event)}>
                  <FontAwesomeIcon icon={faHeartCrack} /> {props?.downvote}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendBlogCard;
