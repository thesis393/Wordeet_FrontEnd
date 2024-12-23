"use client";

import { Card, CardBody, Image, Slider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Button from "../button/default";
import Link from "next/link";
import { formatDate, formatUnixTimestampToDate, NewArticle } from "@/app/api";
import { useRouter } from "next/navigation";
import ReadTipTap from "../tiptap/readtiptap";
import useProgram from "@/app/anchor/config";
import { PublicKey } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";

const ClientBlogs = (props: NewArticle) => {
  const [liked, setLiked] = useState(false);
  const [writerProfile, setWriterProfile] = useState<any>({});
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
  return (
    <Card
      isBlurred
      className="bg-background/60 dark:bg-default-100/50 shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] mx-2 my-4 border-none w-full h-[453px]"
      shadow="sm"
    >
      <CardBody>
        <div className="flex flex-col justify-between items-center gap-2 w-full h-full">
          <div className="relative w-full cursor-pointer">
            <Image
              alt={props.title}
              className="object-cover"
              height={200}
              shadow="md"
              src={`${
                props.coverimage
                  ? props.coverimage
                  : "/assets/image/article/sui-network.webp"
              }`}
              width="100%"
              onClick={() => router.push(`/blog/${props._id}`)}
            />
          </div>

          <div className="flex flex-col flex-1 items-center w-full overflow-hidden">
            <div className="flex justify-center items-start">
              <div
                className="flex flex-col gap-0 font-medium text-large cursor-pointer"
                onClick={() => router.push(`/blog/${props._id}`)}
              >
                {props.title}
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
            <div className="flex justify-between items-center mt-4 w-full">
              <div className="flex justify-start items-center gap-2">
                <Link
                  href={`/profile/${writerProfile.walletaddress}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    alt={writerProfile.username}
                    className="rounded-full object-cover"
                    height={40}
                    shadow="md"
                    src={`${writerProfile.avatar}`}
                    width="40"
                  />
                  <p className="text-sm">{props.username}</p>
                </Link>
              </div>
              <div>
                <p className="text-opacity-40">
                  {formatUnixTimestampToDate(props.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <Button style={"purple"} className="mt-2">
                Collect
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ClientBlogs;
