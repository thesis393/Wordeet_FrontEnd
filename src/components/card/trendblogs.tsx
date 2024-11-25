"use client";

import { Card, CardBody, Image, Slider } from "@nextui-org/react";
import { useState } from "react";
import Button from "../button/default";
import Link from "next/link";
import { IBlogCard } from "@/app/api";

const TrendBlogCard = (props: IBlogCard) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card
      isBlurred
      className="bg-background/60 dark:bg-default-100/50 shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] mx-2 my-4 border-none min-h-[500px]" //max-w-[610px]
      shadow="sm"
    >
      <CardBody>
        <div className="flex flex-col flex-1 justify-center items-center gap-6 md:gap-4">
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

          <div className="flex flex-col flex-1 items-center px-7 py-2">
            <div className="flex flex-1 justify-center items-start">
              <div className="flex flex-col gap-0">
                <Link
                  href={"/blog/testblog"}
                  className="mt-2 font-medium text-large"
                >
                  {props.title}
                </Link>
              </div>
            </div>
            <div className="flex flex-1 justify-center items-start">
              <div className="flex flex-col gap-0 max-h-[75px] overflow-hidden">
                {props.content}
              </div>
            </div>
            <div className="flex w-full"></div>
            <div className="flex justify-between items-center mt-2 w-full">
              <div className="flex justify-start items-center gap-2">
                <Image
                  alt={props.author.username}
                  className="rounded-full object-cover"
                  height={40}
                  shadow="md"
                  src={props.author.avatar}
                  width="100%"
                />
                <p className="text-sm">{props.author.username}</p>
              </div>
              <div>
                <p className="text-opacity-40">{props.createdAt}</p>
              </div>
            </div>
            <Button style={"purple"} className="mt-2">
              Collect
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TrendBlogCard;
