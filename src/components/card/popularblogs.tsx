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

const PopularBlogCard = (props: INewBlogCard) => {
  const [liked, setLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track mount state
  const [writerProfile, setWriterProfile] = useState<any>({});

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
  return (
    <div className="pr-2 border-none rounded-lg w-full h-full">
      <div className="flex flex-col gap-2">
        <div
          className="flex font-medium text-xl break-all cursor-pointer"
          onClick={handleRouter}
        >
          {props.title}
        </div>
        <div className="flex justify-between items-center gap-2 w-full">
          <Link
            href={`/profile/${writerProfile.walletaddress}`}
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularBlogCard;
