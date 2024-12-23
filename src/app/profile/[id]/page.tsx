"use client";
import Layout from "@/components/layout";
import EditProfileModal from "@/components/modal/editprofilemodal";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import { useUserInfo } from "@/provider/UserInfoProvider";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IBlogCard, readUser } from "../../api";
import { useParams } from "next/navigation";
import { readUserInfo } from "@/utils/sinutil";

import { faFeather, faGem, faRibbon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogCard from "@/components/card/blogs";
import { param } from "framer-motion/client";
import { userInfo } from "os";
import { useAppContext } from "@/provider/AppProvider";
import { Flag } from "lucide-react";
import useProgram from "@/app/anchor/config";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { PublicKey } from "@solana/web3.js";

export default function OtherProfile() {
  const [domLoaded, setDomLoaded] = useState(false);
  const [tempuserInfo, setTempUserInfo] = useState<any>();
  const [tempwalletAddress, SetTempWalletAddress] = useState<any>();
  const { walletAddress } = useWalletAddress();
  const { setUserInfo } = useUserInfo();
  const { setLoading } = useAppContext();
  const [createdBlogCnt, setCreatedBlogCnt] = useState(0);
  const [collectedBlogCnt, setCollectedBlogCnt] = useState(0);
  const [Draft, setDraftBlogCnt] = useState(0);
  const [createdBlogs, setCreatedBlogs] = useState<any[]>([]);
  const [collectedBlogs, setCollectedBlogs] = useState<any[]>([]);

  const program = useProgram();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const params = useParams();

  const getUserProfileById = async (walletAddress: any) => {
    console.log("getUserProfileById start", program, walletAddress);
    if (program && walletAddress) {
      console.log("getUserProfileById 2");
      try {
        const tempPubKey = new PublicKey(walletAddress);
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), tempPubKey.toBuffer()],
          program.programId
        );
        console.log("getUserProfileById 3");
        const userProfile = await program.account.userProfile.fetch(userPda);

        console.log("getUserProfileById 4");
        if (userProfile) {
          console.log("readUserInfo: ", userProfile);
          setTempUserInfo(userProfile);

          if (userProfile.walletaddress == walletAddress) {
            setUserInfo(userProfile);
          }
        } else {
          console.log("getUserProfileById 5");
        }
      } catch (error) {
        console.log("Error fetching profile account:", error);
      }
    }
  };

  //SmartContract Way
  const getUserBlogsById = async (walletAddress: any) => {
    try {
      if (!program || !walletAddress) return;
      const allBlogs = await program.account.blogPost.all();

      // Map blog data to formatted posts
      const formattedBlogs = allBlogs.map(({ publicKey, account }) => ({
        _id: publicKey.toString(),
        authorAddress: account.owner.toString(),
        username: account.username,
        coverimage: account.coverimage,
        category: account.category,
        createdAt: account.createdAt,
        title: account.title,
        content: account.content,
        upvote: account.upvote,
        downvote: account.downvote,
        walletaddress: account.walletaddress,
        nftcollectionaddress: account.nftcollectionaddress,
        ntotalcollector: account.ntotalcollecter,
        status: 1,
        lowercaseTitle: account.title.replace(/\s+/g, "-").toLowerCase(),
      }));

      const createdBlogs = formattedBlogs.filter(
        (blog) => blog.walletaddress === walletAddress
      );
      if (createdBlogs.length > 0) {
        setCreatedBlogCnt(createdBlogs.length);
        setCreatedBlogs(createdBlogs);
      }

      const allCollectedBlogs = await program.account.collectorInfo.all();

      const formattedCollectedBlogs = allCollectedBlogs.map(
        ({ publicKey, account }) => ({
          _id: publicKey.toString(),
          avatar: account.avatar,
          username: account.username,
          walletaddress: account.walletaddress,
          nftMintAddress: account.nftMintAddress,
        })
      );

      const collectedBlogs = formattedCollectedBlogs.filter(
        (blog) => blog.walletaddress === walletAddress
      );

      if (collectedBlogs.length > 0) {
        setCollectedBlogCnt(collectedBlogs.length);
        setCollectedBlogs(collectedBlogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const id = params.id;
      if (id !== undefined) {
        try {
          SetTempWalletAddress(id);
          console.log("step 1");
          setLoading(true);

          //Smart contract Way
          await getUserProfileById(id);
          await getUserBlogsById(id);

          //Backend Way
          // const result = await readUserInfo(id);
          // if (result) {
          //   console.log(id, "'s User Info step 1", result);
          //   setTempUserInfo(result);
          //   console.log(
          //     "step 2",
          //     walletAddress,
          //     tempuserInfo?.user?.walletaddress
          //   );
          //   if (tempuserInfo?.user?.walletaddress == walletAddress) {
          //     setUserInfo(tempuserInfo.user);
          //   }
          // }
        } catch (error) {
          console.log("getUserProfileById get error: ", error);
        }
        setLoading(false);
      }
    };
    if (params) {
      fetchData();
    }
  }, [params]);

  const copyAddress = () => {
    navigator.clipboard
      .writeText(`${tempuserInfo?.user?.walletaddress}`)
      .then(() => alert("Address copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal
  const openModal = () => {
    console.log("openModal start");
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    setIsModalOpen(false);

    try {
      await getUserProfileById(tempuserInfo?.walletaddress);
    } catch (error) {
      console.log("getUserProfileById get error: ", error);
    }

    //Backend Way
    // try {
    //   const result = await readUserInfo(tempuserInfo?.user?.walletaddress);
    //   if (result) {
    //     console.log(
    //       tempuserInfo?.user?.walletaddress,
    //       "'s User Info step 1",
    //       result
    //     );
    //     setTempUserInfo(result);
    //     console.log("step 2", walletAddress, tempuserInfo?.user?.walletaddress);
    //     if (tempuserInfo?.user?.walletaddress == walletAddress) {
    //       setUserInfo(tempuserInfo.user);
    //     }
    //   }
    // } catch (error) {
    //   console.log("readUserInfo get error: ", error);
    // }
  };

  useEffect(() => {
    console.log("isModalopen", isModalOpen);
  }, [isModalOpen]);

  return (
    <>
      <Layout>
        {domLoaded && (
          <>
            <div className="flex justify-between items-center border-gray-300 mt-3 p-4 border-b w-full">
              {/* <!-- Profile Section --> */}
              <div className="flex items-center space-x-4">
                {/* <!-- Avatar --> */}
                {/* <div className="flex justify-center items-center bg-gray-500 rounded-full w-24 h-24 font-bold text-4xl text-white"> */}
                <Avatar
                  src={tempuserInfo?.avatar ? `${tempuserInfo?.avatar}` : ""}
                  className="w-28 h-28 text-large"
                />
                {/* <!-- Profile Details --> */}
                <div>
                  {/* Edit Profile Button */}
                  {params.id == walletAddress && (
                    <Button
                      color="default"
                      variant="bordered"
                      onClick={openModal}
                    >
                      Edit Profile
                    </Button>
                  )}

                  {/* EditProfileModal */}

                  <div className="flex items-center space-x-2 mt-1">
                    <span className="pr-1 text-2xl dark:text-white leading-tight">
                      {tempuserInfo?.username}
                      <span className="xs:inline-flex hidden text-2xl">
                        's&nbsp;
                      </span>
                      <span className="xs:inline-flex hidden text-gray-400">
                        Info
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Wallet Address */}
                    <p className="text-gray-500 text-sm">
                      {tempuserInfo?.walletaddress?.slice(0, 4)}...
                      {tempuserInfo?.walletaddress?.slice(-4)}
                    </p>

                    {/* Copy Button */}
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={copyAddress}
                      aria-label="Copy wallet address"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="ml-3 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Stats Section --> */}
              <div className="flex items-center space-x-6 text-gray-500">
                <div className="text-center">
                  <span className="block font-semibold text-lg">
                    {createdBlogCnt}
                  </span>
                  <span className="text-sm">Created</span>
                </div>
                <div className="text-center">
                  <span className="block font-semibold text-lg">
                    {" "}
                    {collectedBlogCnt}
                  </span>
                  <span className="text-sm">Collected</span>
                </div>
                <div className="text-center">
                  <span className="block font-semibold text-lg">
                    {tempuserInfo?.blogs?.drafts?.count}
                  </span>
                  <span className="text-sm">Draft</span>
                </div>
              </div>
            </div>

            {/* <!-- Taps Section --> */}
            <div className="flex items-center gap-3 mt-2 w-full">
              <div className="flex flex-col w-full">
                <Tabs
                  aria-label="Options"
                  color="primary"
                  variant="underlined"
                  classNames={{
                    tabList:
                      "gap-6 w-full relative rounded-none p-0  justify-center",
                    cursor: "w-full bg-[#22d3ee]",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                  }}
                >
                  <Tab
                    key="Created"
                    title={
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faFeather} />
                        <span>Created</span>
                        <Chip size="sm" variant="faded">
                          {createdBlogCnt}
                        </Chip>
                      </div>
                    }
                  >
                    <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_360px)))] 2xl:grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_400px)))] grid-rows-[360px] 2xl:grid-rows-[400px] mydiv">
                      {createdBlogs.map((article: IBlogCard, idx: number) => (
                        <BlogCard {...article} key={idx} />
                      ))}
                    </div>
                  </Tab>
                  <Tab
                    key="Collected"
                    title={
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faGem} />
                        <span>Collected</span>
                        <Chip size="sm" variant="faded">
                          {collectedBlogCnt}
                        </Chip>
                      </div>
                    }
                  >
                    <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_360px)))] 2xl:grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_400px)))] grid-rows-[360px] 2xl:grid-rows-[400px] mydiv">
                      {collectedBlogs.map((article: IBlogCard, idx: number) => (
                        <BlogCard {...article} key={idx} />
                      ))}
                    </div>
                  </Tab>
                  <Tab
                    key="Draft"
                    title={
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faRibbon} />
                        <span>Draft</span>
                        <Chip size="sm" variant="faded">
                          {tempuserInfo?.blogs?.drafts?.count}
                        </Chip>
                      </div>
                    }
                  >
                    <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_360px)))] 2xl:grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_400px)))] grid-rows-[360px] 2xl:grid-rows-[400px] mydiv">
                      {tempuserInfo?.blogs?.drafts?.data.map(
                        (article: IBlogCard, idx: number) => (
                          <BlogCard {...article} key={idx} />
                        )
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </>
        )}
        <EditProfileModal isOpen={isModalOpen} onClose={closeModal} />
      </Layout>
    </>
  );
}
