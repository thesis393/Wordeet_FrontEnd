"use client";

import { Card, CardBody, Image, Slider } from "@nextui-org/react";
import { useState } from "react";
import Button from "../button/default";
import Link from "next/link";
import { formatDate, IBlogCard } from "@/app/api";
import { useRouter } from "next/navigation";
import ReadTipTap from "../tiptap/readtiptap";

const ClientBlogs = (props: IBlogCard) => {
  const [liked, setLiked] = useState(false);
  const router = useRouter();

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
              src={`${props.coverimage}`}
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
