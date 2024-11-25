'use client'

import { Card, CardBody, Image, Button, Slider } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

interface IArticleCard {
  title: string;
  content: string;
  createdAt: string;
  image: string;
  id: string;
}

const ArticleCard = (props: IArticleCard) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            <Image
              alt={props.title}
              className="object-cover"
              height={200}
              shadow="md"
              src={props.image}
              width="100%"
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-8 h-full">
            <div className="flex justify-center items-center flex-1">
              <div className="flex flex-col gap-0">
                <Link href={"/blog/testblog"} className="text-large font-medium mt-2">{props.title}</Link>
              </div>
            </div>
            <div className="flex w-full">
              <p>{props.createdAt}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default ArticleCard