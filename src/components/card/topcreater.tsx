"use client";

import { Avatar, Card, CardBody, Image } from "@nextui-org/react";
import Link from "next/link";

const TopCreaterCard = ({ user }: any) => {
  console.log("user", user);
  return (
    <div className="flex flex-row gap-8 overflow-hidden">
      <Link href={`/profile/${user?.walletaddress}`}>
        <div className="flex gap-8 basis-1/4">
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            className=""
            size="lg"
          />
        </div>
      </Link>
      <div className="flex flex-col justify-center items-start basis-3/4">
        <p>{user?.username}</p>
        <p>{`Total Counter: ${user?.blogCount}`}</p>
      </div>
    </div>
  );
};

export default TopCreaterCard;
