"use client";

import Image from "next/image";
import Link from "next/link";
import { MenuButton } from "../button/menu";
import { usePathname, useRouter } from "next/navigation";
import ConnectButton from "../button/connect";

const Navbar = (props: any) => {
  const { children } = props;

  const menu1 = [
    {
      title: "dashboard",
      path: "/blog/list",
    },
    {
      title: "wordeets",
      path: "/wordeets",
    },
  ];

  // const menu2 = [
  //   {
  //     title: "Create Articles",
  //     path: "/blog/new",
  //   },
  //   {
  //     title: "Profile",
  //     path: "/profile",
  //   },
  // ];

  const pathName = usePathname();

  return (
    <div className="flex justify-between items-center mx-auto px-2 md:px-10 xl:px-20 py-2 md:py-4 2xl:max-w-screen-2xl xl:max-w-screen-xl main-header">
      <nav className="flex items-center gap-1 lg:gap-6 xl:gap-[38px]">
        <Link href={"/"}>
          {pathName === "/" ? (
            <div className="font-semibold text-4xl text-white">wordeet</div>
          ) : (
            <div className="font-semibold text-[#3730A3] text-4xl">wordeet</div>
          )}
        </Link>
        <div className="flex flex-row items-center">
          {menu1.map((item, idx) => (
            <MenuButton
              href={item.path}
              key={idx}
              active={pathName === item.path}
              className="lg:flex hidden"
            >
              {item.title}
            </MenuButton>
          ))}
        </div>
      </nav>

      <div className="flex flex-row items-center gap">
        <div className="flex flex-row items-center">
          <Link
            href={"/blog/new"}
            className={`lg:flex items-center gap-3 hidden h-fit text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.7)] ${
              pathName === "/blog/new" ? "text-[#000000]" : ""
            } active:text-[#000000] px-4 xl:px-8 py-3`}
          >
            <div>
              <Image
                src={`/assets/ico/ico_edit.svg`}
                alt="logo"
                width={25}
                height={25}
                className="text-[#000000]"
              />
            </div>
            <div>Write</div>
          </Link>
        </div>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
