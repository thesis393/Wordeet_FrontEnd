"use client";

import { Button, Card, CardBody, Image, Slider } from "@nextui-org/react";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { useDraftBlogInfo } from "@/provider/DraftBlogProvider";
import { createNftCollection } from "@/utils/createnftcollectioni";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintNft } from "@/utils/createnft";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { useAppContext } from "@/provider/AppProvider";

const BlogCard = (props: IBlogCard) => {
  const [liked, setLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track mount state
  const { setDraftBlogInfo } = useDraftBlogInfo();
  const { userInfo } = useUserInfo();
  const { setLoading } = useAppContext();
  const wallet = useWallet();

  const router = useRouter();

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
              src={`${props.coverimage}`}
              width="100%"
              onClick={handleRouter}
              radius="none"
            />
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
                  <div className="flex flex-col">
                    <p className="text-sm">{props.author.username}</p>
                    <p className="text-black text-sm text-opacity-50">
                      {formatDate(props.createdAt)}
                    </p>
                  </div>
                </Link>
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
