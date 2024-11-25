"use client";

import Link from "next/link";
import { FooterButton } from "../button/menu";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";

typeof window !== "undefined";

const LandingFooter = (props: any) => {
  const { children } = props;

  const menu = [
    {
      icon: 'btn_x.svg',
      title: "X (formerly Twitter)",
      path: "/",
    },
    {
      icon: 'btn_telegram.svg',
      title: "Telegram",
      path: "/blog/list",
    },
    {
      icon: 'btn_discord.svg',
      title: "Discord",
      path: "/",
    },
  ];

  const pathName = usePathname();

  return (
    <footer className="bg-gradient-to-r bg-[#1C1B1F] text-white py-6 sm:py-12 px-4 sm:px-0">
      <div className="flex justify-around gap-7 mx-auto mt-5 mb-5 container flex-col lg:flex-row">
        <h3 className="text-2xl sm:text-3xl font-semibold ">Wordeet</h3>
        <div className="flex flex-wrap gap-8 md:flex-row sm:gap-4 flex-1 justify-between lg:justify-around w-full">
          <div className="flex flex-col gap-4">
            <p className="text-2xl sm:text-3xl">Learn More</p>
            <Link href={`/learn`}>
              Learn More
            </Link>
            <Link href={`/learn`}>
              Learn More
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-2xl sm:text-3xl">Learn More</p>
            <Link href={`/learn`}>
              Learn More
            </Link>
            <Link href={`/learn`}>
              Learn More
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-2xl sm:text-3xl">Community</p>
            {menu.map((item, idx) => (
              <Link key={idx} href={item.path} className="flex gap-1 items-center">
                <Image src={`/assets/ico/${item.icon}`} className="hover:scale-105 active:scale-99"/>
                <p>{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
