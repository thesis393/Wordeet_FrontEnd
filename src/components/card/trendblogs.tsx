"use client";

import {
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  Image,
  Slider,
} from "@nextui-org/react";
import { useState } from "react";
import Button from "../button/default";
import Link from "next/link";
import {
  addCollector,
  formatDate,
  getBlogNFTCollectionAddress,
  IBlogCard,
  updateBlogNFTCollectionAddress,
} from "@/app/api";
import ReadTipTap from "../tiptap/readtiptap";
import { useAppContext } from "@/provider/AppProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { createNftCollection } from "@/utils/createnftcollectioni";
import { mintNft } from "@/utils/createnft";
import { useUserInfo } from "@/provider/UserInfoProvider";

const TrendBlogCard = (props: IBlogCard) => {
  const [liked, setLiked] = useState(false);

  const { setLoading } = useAppContext();
  const wallet = useWallet();
  const { userInfo } = useUserInfo();

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
  return (
    <Card
      isBlurred
      className="bg-background/60 dark:bg-default-100/50 shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] mx-2 my-4 border-none h-[500px]" //max-w-[610px]
      shadow="sm"
    >
      <CardBody>
        <div className="flex flex-col justify-between items-center gap-2 md:gap-4 w-full h-full">
          <div className="relative w-full">
            <Image
              alt={props.title}
              className="object-cover"
              height={200}
              shadow="md"
              src={props.coverimage}
              width="100%"
            />
          </div>
          <div className="flex flex-col flex-1 items-center w-full overflow-hidden">
            <div className="flex flex-1 justify-center items-start">
              <div className="flex flex-col gap-0">
                <Link
                  href={"/blog/testblog"}
                  className="mt-2 font-medium text-4xl"
                >
                  {props.title}
                </Link>
              </div>
            </div>
            <div className="flex flex-1 items-start w-full">
              <div className="flex flex-col gap-0 w-full overflow-hidden">
                <ReadTipTap
                  content={props.content}
                  // onChange={handleContentChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mt-2 w-full">
              <div className="flex flex-row justify-start items-center gap-2">
                <Link
                  href={`/profile/${props.author.walletaddress}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    alt={props.author.username}
                    className="rounded-full object-cover"
                    height={40}
                    shadow="md"
                    src={`${props.author.avatar}`}
                    width="40"
                  />
                  <p className="text-sm">{props.author.username}</p>
                </Link>
              </div>
              <div>
                <p className="text-opacity-40">{formatDate(props.createdAt)}</p>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <AvatarGroup
                isBordered
                max={5}
                total={props?.nTotalCollecter}
                renderCount={(count) => (
                  <p className="font-medium text-foreground text-small ms-2">
                    {count} Collected
                  </p>
                )}
              >
                {props?.collectorInfos?.map((item: any, idx: number) => (
                  <Link href={`/profile/${item.walletaddress}`} key={idx}>
                    <Avatar src={item?.avatar} size="sm" />
                  </Link>
                ))}
              </AvatarGroup>
            </div>
            <div className="flex justify-center w-full">
              <Button
                style={"purple"}
                className="mt-2"
                onClick={onClickCardBtn}
              >
                Collect
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TrendBlogCard;
