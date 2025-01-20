"use client";

import {
  Article,
  Article_,
  fetchBlog,
  getBlog,
  getClientBlogs,
  getDataFromIrys,
  getRecentLimitBlogsExcludingUser,
  IBlogCard,
  NewArticle,
} from "@/app/api";

import Layout from "@/components/layout";
import { Avatar, AvatarGroup, Card, Image, Input } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import ArticleCard from "@/components/card/article";
import BlogCard from "@/components/card/wideblogs";
import useScreenWidth from "@/utils/screen";
import ClientBlogs from "@/components/card/clientblogs";
import CustomButton from "@/components/button/custombutton";
import ReadTipTap from "@/components/tiptap/readtiptap";
import { Bitcoin, CameraIcon, CoinsIcon, HandCoins } from "lucide-react";
import TipModal from "@/components/modal/tipmodal";
import useProgram from "@/app/anchor/config";
import { PublicKey } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { write } from "fs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useUserInfo } from "@/provider/UserInfoProvider";
import * as web3 from "@solana/web3.js";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { createNftCollection } from "@/utils/createnftcollection";
import { mintNft } from "@/utils/createnft";

interface VoteInfo {
  status: number; // 1 = upvote, 2 = downvote
}
const BlogPage = () => {
  const [blog, setBlog] = useState<NewArticle>();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientBlogs, setClientBlogs] = useState<NewArticle[]>([]);
  const [otherBlogs, setOtherBlogs] = useState<NewArticle[]>([]);
  const [walletaddress, setWalletAddress] = useState<string>("");
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [nLimitClientBlogs, setLimitClientBlogs] = useState(2);
  const [writerProfile, setWriterProfile] = useState<any>({});
  const [collectorInfo, setCollectorInfo] = useState<any[]>([]);
  const [irysTransaction, setIrysTransaction] = useState<string | null>(null);
  const [domLoaded, setDomLoaded] = useState(false);
  const [myVoteInfo, setVoteInfo] = useState<VoteInfo>({ status: 0 });
  const [transactionPending, setTransactionPending] = useState(false);

  const wallet = useWallet();
  const params = useParams();
  const program = useProgram();
  const { userInfo } = useUserInfo();

  // Function to open Tip modal
  const openTipModal = () => {
    console.log("openTipModal start");
    setIsTipModalOpen(true);
  };

  const closeTipModal = () => {
    console.log("closeTipModal");
    setIsTipModalOpen(false);
  };

  const extractIdentifier = (url: string | null): string | null => {
    if (url) {
      const match = url.match(/\/([^/]+)$/); // Match the last part after the last '/'
      return match ? match[1] : null;
    }
    return null;
  };

  const router = useRouter();

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
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

        console.log("formattedCollector:", formattedCollector);
        console.log("params._id", params.id);

        const filteredCollector = formattedCollector
          .filter((collector) => collector.blogPost.toString() == params.id)
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

  //SmartContract Way
  useEffect(() => {
    const fetchClientBlogs = async () => {
      setIsLoading(true);

      try {
        const myid = params.id;
        console.log("myid", myid);
        console.log("ddd", blog?.walletaddress);
        if (blog?.walletaddress && program) {
          const allBlogs = await program.account.blogPost.all();
          // Map blog data to formatted posts
          const formattedBlogs = await Promise.all(
            allBlogs.map(async ({ publicKey, account }) => {
              const identifier = extractIdentifier(account.content);
              setIrysTransaction(identifier);
              const irysResponse = await getDataFromIrys(`${account.content}`);
              const content = irysResponse?.data?.content || account.content; // Use fetched content or fallback to original

              return {
                _id: publicKey.toString(),
                owner: account.owner.toString(),
                username: account.username,
                coverimage: account.coverimage,
                category: account.category,
                createdAt: account.createdAt,
                title: account.title,
                content,
                upvote: account.upvote,
                downvote: account.downvote,
                keywords: account.keywords,
                walletaddress: account.walletaddress,
                nftcollectionaddress: account.nftcollectionaddress,
                ntotalcollector: account.ntotalcollecter,
                status: 1,
                lowercaseTitle: account.title
                  .replace(/\s+/g, "-")
                  .toLowerCase(),
              };
            })
          );

          const filteredBlogs = formattedBlogs.filter(
            (blog) => blog._id !== myid && blog.walletaddress === walletaddress
          );

          const clientsBlogs = filteredBlogs
            .slice()
            .sort((a, b) => b.upvote - a.upvote)
            .slice(0, nLimitClientBlogs);

          setClientBlogs(clientsBlogs);
          console.log("getClientBlogs", clientsBlogs);
          const otherBlogsResult = formattedBlogs
            .filter((blog) => blog.walletaddress != walletaddress)
            .slice()
            .sort((a, b) => b.upvote - a.upvote)
            .slice(0, nLimitClientBlogs);
          setOtherBlogs(otherBlogsResult);
          getWriterInfo();
          getCollectorInfo();
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch blogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientBlogs();
  }, [walletaddress]);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const getWriterInfo = async () => {
    try {
      const id = params.id;

      const tempPubKey = new PublicKey(walletaddress);

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

  //Backend Way
  // useEffect(() => {
  //   const fetchClientBlogs = async () => {
  //     setIsLoading(true);

  //     try {
  //       console.log("ddd", blog?.blog?.walletaddress);
  //       if (blog?.blog?.walletaddress) {
  //         console.log("ddd", blog?.blog?.walletaddress);

  //         const result = await getClientBlogs(
  //           blog?.blog?.walletaddress,
  //           2,
  //           blog?.blog?._id
  //         );
  //         setClientBlogs(result);
  //         console.log("getClientBlogs", result);
  //         const otherBlogsResult = await getRecentLimitBlogsExcludingUser(
  //           blog?.blog?.walletaddress,
  //           2
  //         );
  //         setOtherBlogs(otherBlogsResult);
  //       }
  //     } catch (err: any) {
  //       setError(err.message || "Failed to fetch blogs");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchClientBlogs();
  // }, [walletaddress]);

  //SmartContract way

  useEffect(() => {
    const fetchData = async () => {
      const id = params.id;
      if (id !== undefined && program) {
        try {
          const pdaPublicKey = new PublicKey(id);
          const aBlog = await program.account.blogPost.fetch(pdaPublicKey);

          if (aBlog) {
            const irysResponse = await getDataFromIrys(`${aBlog.content}`);
            const content = irysResponse?.data?.content || aBlog.content; // Use fetched content or fallback to original
            // Map blog data to formatted posts
            const formattedBlog = {
              _id: id,
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
            setBlog(formattedBlog as NewArticle);
            setWalletAddress(formattedBlog?.walletaddress);
            console.log("User get blog", formattedBlog);
          }
        } catch (error) {
          console.error("Error get blog", error);
        }
      }
    };
    if (params) {
      fetchData();
    }
  }, [params]);

  const onClickCollector = (walletAddress: any, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`Clicked collector with wallet: ${walletAddress}`);
    if (walletAddress) {
      router.push(`/profile/${walletAddress}`);
    }
  };

  //Backend way
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const id = params.id;
  //     if (id !== undefined) {
  //       try {
  //         const result = await getBlog(id);
  //         if (result) {
  //           setBlog(result as Article_);
  //           setWalletAddress(result?.author?.walletaddress);
  //           console.log("User get blog", result);
  //         }
  //       } catch (error) {
  //         console.error("Error get blog", error);
  //       }
  //     }
  //   };
  //   if (params) {
  //     fetchData();
  //   }
  // }, [params]);

  // Function to create Vote Info (if it doesn't exist)
  const createVoteInfo = async (voteStatus: number = 0) => {
    if (program && params.id) {
      try {
        setTransactionPending(true);
        console.log("createVoteInfo start: " + voteStatus);

        const blogPdaPublicKey = new PublicKey(params.id);
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
    if (program && params.id) {
      const blogPdaPublicKey = new PublicKey(params.id);

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
    if (program && !transactionPending && params.id) {
      setTransactionPending(true);

      const blogPdaPublicKey = new PublicKey(params.id);
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
      `updateNFTCollectionAddress input param blogId: ${blogId}, nftCollectionAddress: ${nftCollectionAddress}, blogData.walletaddress: ${blogData.walletaddress}`
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

  const onClickMintBtn = async () => {
    await collectBlog(blog, wallet, window.location.href);
  };

  const screenWidth = useScreenWidth();

  return (
    <>
      {domLoaded && (
        <Layout>
          {blog && (
            <div className="py-12 w-11/12 container">
              <div>
                <Image
                  alt={blog?.title}
                  className="object-cover"
                  height={200}
                  shadow="md"
                  // src={"/assets/image/article/sui-network.webp"}
                  src={
                    blog?.coverimage
                      ? `${blog?.coverimage}`
                      : "/assets/image/article/sui-network.webp"
                  }
                  width="100%"
                />
              </div>
              <h2 className="mt-4 text-2xl ms:text-3xl xl:text-4xl">
                {blog?.title}
              </h2>

              <div className="mt-2 text-lg leading-8">
                <ReadTipTap
                  content={blog?.content}
                  onChange={handleContentChange}
                />
              </div>

              <div className="flex flex-row justify-between mt-8">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${writerProfile?.walletaddress}`}
                      className="flex items-center gap-2"
                    >
                      <Avatar
                        alt={writerProfile?.username}
                        className="rounded-full object-cover"
                        src={writerProfile?.avatar}
                        size="lg"
                        isBordered
                        color="success"
                      />
                      <p className="text-lg">{writerProfile?.username}</p>
                    </Link>
                  </div>
                  <Button
                    onClick={openTipModal}
                    color="default"
                    variant="ghost"
                    size="sm"
                    startContent={<CoinsIcon />}
                  >
                    tip
                  </Button>
                </div>
                <div className="flex flex-row items-center gap-5">
                  <div className="flex flex-row gap-5">
                    <div
                      onClick={(event) => onClickUpvote(event)}
                      className="cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faHeart} /> {blog?.upvote}
                    </div>
                    <div
                      onClick={(event) => onClickDownvote(event)}
                      className="cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faHeartCrack} /> {blog?.downvote}
                    </div>
                  </div>
                  <Button
                    className="text-right bg-primary shadow-lg text-white"
                    onClick={onClickMintBtn}
                  >
                    Collect
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mt-3">
                <AvatarGroup
                  isBordered
                  max={5}
                  total={blog?.ntotalcollector}
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

              <div className="mt-32">
                <p className="text-2xl text-center">
                  Subscribe to {blog?.username}
                </p>
                <div className="flex justify-center mt-3">
                  <div className="flex justify-center items-center border-gray-300 border rounded rounded-xl w-full max-w-md overflow-hidden">
                    <input
                      type="email"
                      placeholder={blog?.username}
                      className="flex-1 px-4 py-2 w-full text-gray-700 focus:outline-none"
                    />
                    <CustomButton
                      style={"purple"}
                      className="flex-1 rounded-none rounded-r-xl"
                    >
                      Submit
                    </CustomButton>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-8 mt-6">
                <Card>
                  <div className="flex sm:flex-row flex-col justify-between items-center p-4">
                    <div>
                      <p className="text-xl">
                        Subscribe to Social Graph Ventures
                      </p>
                      <p>Receive the latest updates directly to your inbox</p>
                    </div>
                  </div>
                </Card>
                <div className="flex md:flex-row flex-col gap-8">
                  <Card className="p-4 basis-1/2">
                    <div className="flex flex-col items-center gap-8">
                      <Image
                        src={
                          blog?.coverimage
                            ? blog?.coverimage
                            : `/assets/image/article/6.png`
                        }
                        alt=""
                        width={200}
                        height={200}
                      />
                      <div className="flex flex-col items-center gap-4">
                        <p>
                          Mint this entry as an NFT to add it to your
                          collection.
                        </p>
                        <Button onClick={onClickMintBtn}>Mint</Button>
                        <AvatarGroup
                          isBordered
                          max={5}
                          total={blog?.ntotalcollector}
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
                    </div>
                  </Card>
                  <Card className="flex flex-col p-8 basis-1/2">
                    <div className="flex flex-1">
                      <p>Verification</p>
                      <p>
                        This entry has been permanently stored onchain and
                        signed by its creator.
                      </p>
                    </div>
                    <div className="border-gray-900 border rounded-xl divide-y-1 divide-gray-900">
                      <div className="flex flex-col px-3 py-1">
                        <p className="text-xs uppercase">Irys transaction</p>
                        <p className="text-sm">{irysTransaction}</p>
                      </div>
                      {blog?.nftcollectionaddress ? (
                        <div className="flex flex-col px-3 py-1">
                          <p className="text-xs uppercase">NFT Address</p>
                          <p className="text-sm">
                            {blog?.nftcollectionaddress}
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {blog?.walletaddress ? (
                        <div className="flex flex-col px-3 py-1">
                          <p className="text-xs uppercase">AUTHOR ADDRESS</p>
                          <p className="text-sm">{blog?.walletaddress}</p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {blog?._id ? (
                        <div className="flex flex-col px-3 py-1">
                          <p className="text-xs uppercase">Content Digest</p>
                          <p className="text-sm">{blog?._id}</p>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
              <div className="mt-10">
                {clientBlogs?.length ? (
                  <>
                    <div className="flex justify-between items-center felx-row">
                      <p className="text-2xl">
                        Check Out More Articles By {writerProfile?.username}
                      </p>
                      <div
                        className="text-4xl text-primary cursor-pointer"
                        onClick={() => {
                          router.push(`/profile/${walletaddress}`);
                        }}
                      >
                        View All
                      </div>
                    </div>
                    <div className="">
                      <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_480px)))] grid-rows-[453px] mydiv">
                        {clientBlogs.map((article, idx: number) => (
                          <ClientBlogs {...article} key={idx} />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="mt-10">
                {otherBlogs?.length ? (
                  <>
                    <div className="flex flex-row justify-between cursor-pointer">
                      <p className="text-2xl">
                        More Articles from Different Writes
                      </p>
                      <div
                        className="text-4xl text-primary"
                        onClick={() => {
                          router.push(`/blog/list`);
                        }}
                      >
                        View All
                      </div>
                    </div>
                    <div className="">
                      <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_357px)))] grid-rows-[453px] mydiv">
                        {otherBlogs.map((article, idx: number) => (
                          <ClientBlogs {...article} key={idx} />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
          <TipModal
            isOpen={isTipModalOpen}
            onClose={closeTipModal}
            DesPubKey={walletaddress}
          />
        </Layout>
      )}
    </>
  );
};

const Breadcrumb = () => {
  return (
    <div className="flex items-center">
      <Link href="/blog/list" className="text-gray-500">
        Blogs
      </Link>
      <span className="mx-2">/</span>
      <span className="font-semibold">Billing</span>
    </div>
  );
};

export default BlogPage;
