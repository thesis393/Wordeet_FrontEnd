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
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faFeather, faGem, faRibbon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogCard from "@/components/card/blogs";
import { param } from "framer-motion/client";

export default function OtherProfile() {
  const [domLoaded, setDomLoaded] = useState(false);
  const [tempuserInfo, setTempUserInfo] = useState<any>();
  const [tempwalletAddress, SetTempWalletAddress] = useState<any>();
  const { walletAddress } = useWalletAddress();
  const { setUserInfo } = useUserInfo();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const id = params.id;
      if (id !== undefined) {
        try {
          SetTempWalletAddress(id);
          console.log("step 1");
          const result = await readUserInfo(id);
          if (result) {
            console.log(id, "'s User Info step 1", result);
            setTempUserInfo(result);
            console.log(
              "step 2",
              walletAddress,
              tempuserInfo?.user?.walletaddress
            );
            if (tempuserInfo?.user?.walletaddress == walletAddress) {
              setUserInfo(tempuserInfo.user);
            }
          }
        } catch (error) {
          console.error("readUserInfo get error: ", error);
        }
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

  const closeModal = () => {
    readUserInfo(tempuserInfo?.user?.walletaddress);
    setIsModalOpen(false);
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
                  src={
                    tempuserInfo?.user?.avatar
                      ? `https://ipfs.io/ipfs/${tempuserInfo?.user?.avatar}`
                      : ""
                  }
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
                      {tempuserInfo?.user?.username}
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
                      {tempuserInfo?.user.walletaddress?.slice(0, 4)}...
                      {tempuserInfo?.user.walletaddress?.slice(-4)}
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
                    {tempuserInfo?.blogs?.created?.count}
                  </span>
                  <span className="text-sm">Created</span>
                </div>
                <div className="text-center">
                  <span className="block font-semibold text-lg">
                    {" "}
                    {tempuserInfo?.blogs?.collected?.count}
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
                          {tempuserInfo?.blogs?.created?.count}
                        </Chip>
                      </div>
                    }
                  >
                    <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_357px)))] grid-rows-[453px] mydiv">
                      {tempuserInfo?.blogs?.created?.data.map(
                        (article: IBlogCard, idx: number) => (
                          <BlogCard
                            {...article}
                            author={tempuserInfo?.user}
                            key={idx}
                          />
                        )
                      )}
                    </div>
                  </Tab>
                  <Tab
                    key="Collected"
                    title={
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faGem} />
                        <span>Collected</span>
                        <Chip size="sm" variant="faded">
                          {tempuserInfo?.blogs?.collected?.count}
                        </Chip>
                      </div>
                    }
                  >
                    <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_357px)))] grid-rows-[453px] mydiv">
                      {tempuserInfo?.blogs?.collected?.data.map(
                        (article: IBlogCard, idx: number) => (
                          <BlogCard
                            {...article}
                            author={tempuserInfo?.user}
                            key={idx}
                          />
                        )
                      )}
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
                    <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_357px)))] grid-rows-[453px] mydiv">
                      {tempuserInfo?.blogs?.drafts?.data.map(
                        (article: IBlogCard, idx: number) => (
                          <BlogCard
                            {...article}
                            author={tempuserInfo?.user}
                            key={idx}
                          />
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
