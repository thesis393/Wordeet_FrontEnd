"use client";

import Link from "next/link";
import { FooterButton } from "../button/menu";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";

typeof window !== "undefined";

const Footer = (props: any) => {
  const { children } = props;

  const menu = [
    {
      title: "Learn more",
      path: "/learn",
    },
    {
      title: "Terms & Conditions",
      path: "/",
    },
    {
      title: "Blog",
      path: "/blog/list",
    },
    {
      title: "Support",
      path: "/",
    },
  ];

  const pathName = usePathname();

  return (
    <footer className="bg-gradient-to-r from-primary-100 to-primary-200 mt-4">
      <div className="flex flex-col justify-around items-center gap-7 mx-auto mt-5 mb-5 container">
        <div className="flex">
          {menu.map((item, idx) => (
            <FooterButton
              href={item.path}
              key={idx}
              active={pathName === item.path}
              className="lg:flex hidden"
            >
              {item.title}
            </FooterButton>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
