"use client";

import Image from "next/image";
import Link from "next/link";
import { MenuButton } from "../button/menu";
import { usePathname, useRouter } from "next/navigation";
import ConnectButton from "../button/connect";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useSearchInfo } from "@/provider/SearchInfoProvider";

const Navbar = (props: any) => {
  const { children } = props;
  const [query, setQuery] = useState("");
  const { setSearchInfo } = useSearchInfo();

  const handleSearch = () => {
    if (query.trim()) {
      console.log("Searching for:", query);
      // Add your search logic here, such as API call or state update
      setSearchInfo(query);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

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

  const pathName = usePathname();

  return (
    <div className="flex justify-between items-center mx-auto px-2 md:px-5 xl:px-10 py-2 md:py-4 2xl:max-w-screen-2xl xl:max-w-screen-xl main-header">
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
        <Input
          isClearable
          radius="md"
          classNames={{
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="Type to search..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Add the event handler here
          startContent={
            <SearchIcon className="flex-shrink-0 mb-0.5 text-black/50 text-slate-400 dark:text-white/90 pointer-events-none" />
          }
        />
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
