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
import { useState } from "react";
import Link from "next/link";
import {
  addCollector,
  formatDate,
  getBlogNFTCollectionAddress,
  IBlogCard,
  statusText,
  updateBlogNFTCollectionAddress,
} from "@/app/api";
import ReadTipTap from "../tiptap/readtiptap";
import { useAppContext } from "@/provider/AppProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { createNftCollection } from "@/utils/createnftcollectioni";
import { mintNft } from "@/utils/createnft";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { useRouter } from "next/navigation";
import { useDraftBlogInfo } from "@/provider/DraftBlogProvider";

const TrendBlogCard = (props: IBlogCard) => {
  const [liked, setLiked] = useState(false);

  const { setLoading } = useAppContext();
  const wallet = useWallet();
  const { userInfo } = useUserInfo();
  const { setDraftBlogInfo } = useDraftBlogInfo();

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

  const router = useRouter();
  const handleRouter = () => {
    if (props.status) {
      router.push(`/blog/${props._id}`);
    } else {
      setDraftBlogInfo(props);
      router.push(`/blog/new/${props._id}`);
    }
  };
  return (
    <div className="border-none rounded-lg w-full h-full">
      <div className="flex md:flex-row flex-col justify-between gap-5 w-full h-full">
        <div className="flex-shrink-0 h-full basis-1/2">
          <Image
            alt={props.title}
            className="h-full aspect-[4/3] object-cover"
            height="100%"
            shadow="md"
            src={`${props.coverimage}`}
            width="100%"
            onClick={handleRouter}
            radius="none"
          />
        </div>
        <div className="relative flex flex-col flex-shrink-0 justify-between gap-3 px-5 py-5 line-break-anywhere basis-1/2">
          <div className="flex justify-between items-center gap-2 w-full">
            <Link
              href={`/profile/${props.author.walletaddress}`}
              className="flex items-center gap-2"
            >
              <Image
                alt={props.author.username}
                className="rounded-full object-cover"
                height={20}
                shadow="md"
                src={`${props.author.avatar}`}
                width="20"
              />
              <p className="text-sm">{props.author.username}</p>
              <p className="text-black text-sm text-opacity-50">
                {formatDate(props.createdAt)}
              </p>
            </Link>
          </div>
          <div className="flex flex-col flex-1 items-center w-full h-full overflow-hidden basis-2/3">
            <div className="flex items-start px-2 w-full">
              <div
                className="flex flex-col gap-0 font-medium text-xl break-all cursor-pointer"
                onClick={handleRouter}
              >
                {props.title}
              </div>
            </div>
            <div className="flex flex-1 items-start w-full overflow-hidden">
              <div className="flex flex-col gap-0 w-full max-h-[150px] overflow-hidden read-only">
                <ReadTipTap content={props.content} />
              </div>
            </div>
          </div>
          <div className="flex justify-between basis-1/6">
            <Button radius="sm" onClick={handleRouter}>
              Read More
            </Button>
          </div>
          <div className="flex flex-col pr-5 w-full bais-1/6">
            <div className="flex justify-between items-center gap-2 w-full">
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
    </div>
  );
};

export default TrendBlogCard;
