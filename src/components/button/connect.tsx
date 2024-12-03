"use client";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import { faWallet } from "@fortawesome/fontawesome-free-solid";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, user } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { div } from "framer-motion/client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  User,
} from "@nextui-org/react";

import Link from "next/link";
import { useContext, useEffect } from "react";
import { readUser } from "@/app/api";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { readUserInfo } from "@/utils/sinutil";
import { useRouter } from "next/navigation";

const ConnectButton = (props: any) => {
  const { children, href, className, active } = props;
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect, signTransaction, sendTransaction } =
    useWallet();
  const { walletAddress, setWalletAddress } = useWalletAddress();
  const { userInfo, setUserInfo } = useUserInfo();

  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      setWalletAddress(publicKey?.toBase58());
      const result = await readUserInfo(publicKey?.toBase58());
      console.log("readUserInfo: ", result);
      if (result != null) setUserInfo(result.user);
      console.log("publickey changed", publicKey?.toBase58());
    };
    if (publicKey) {
      fetch();
    }
  }, [publicKey]);

  return (
    <>
      {publicKey ? (
        <>
          <Dropdown
            showArrow
            radius="sm"
            classNames={{
              base: "before:bg-default-200", // change arrow background
              content: "p-0 border-small border-divider bg-background",
            }}
          >
            <DropdownTrigger>
              {/* <Button variant="ghost" disableRipple>
                Open Menu
              </Button> */}
              <Avatar
                isBordered
                radius="sm"
                color="success"
                src={
                  userInfo?.avatar
                    ? `${userInfo?.avatar}`
                    : "https://i.pravatar.cc/150?u=a042581f4e29026704d"
                }
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Custom item styles"
              disabledKeys={["profile"]}
              className="p-3"
              itemClasses={{
                base: [
                  "rounded-md",
                  "text-default-500",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "data-[hover=true]:bg-default-100",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              }}
            >
              <DropdownSection aria-label="Profile & Actions" showDivider>
                <DropdownItem
                  isReadOnly
                  key="profile"
                  textValue="profile"
                  className="gap-2 opacity-100 h-14"
                >
                  <User
                    name={userInfo?.username}
                    description={userInfo?.bio}
                    classNames={{
                      name: "text-default-600",
                      description: "text-default-500",
                    }}
                    avatarProps={{
                      size: "md",
                      src: `${userInfo?.avatar}`,
                    }}
                  />
                </DropdownItem>
                <DropdownItem
                  key="dashboard"
                  textValue="dashboard"
                  onClick={() => {
                    router.push("/blog/list");
                  }}
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="wordeets"
                  textValue="wordeets"
                  onClick={() => {
                    router.push("/wordeets/");
                  }}
                >
                  Wordeets
                </DropdownItem>
                <DropdownItem
                  key="profiles"
                  textValue="profiles"
                  href={`/profile/${walletAddress}`}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="Write"
                  textValue="Write"
                  onClick={() => {
                    router.push("/blog/new");
                  }}
                >
                  Write
                </DropdownItem>
              </DropdownSection>

              <DropdownSection aria-label="Disconnect">
                <DropdownItem
                  key="disconnect"
                  textValue="disconnect"
                  onClick={disconnect}
                >
                  Disconnect
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </>
      ) : (
        <div
          className={`${className} relative capitalize bg-primary gap-2 text-white  rounded-xl h-fit shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] px-3 py-3 cursor-pointer  group `}
        >
          <div
            onClick={() => setVisible(true)}
            className="flex items-center gap-1"
          >
            {/* <FontAwesomeIcon icon={faWallet as IconProp} /> */}
            <span className="sm:flex hidden">connect wallet</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectButton;
