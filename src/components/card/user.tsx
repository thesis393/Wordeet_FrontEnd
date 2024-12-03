"use client";

import { Avatar, Card, CardBody, Image } from "@nextui-org/react";
import Link from "next/link";

const UserCard = ({ user }: any) => {
  console.log("user", user);
  return (
    <Card>
      <CardBody className="flex gap-8 overflow-hidden">
        <Link href={`/profile/${user?.walletaddress}`}>
          <div className="flex gap-8">
            <Avatar src={user?.avatar} alt={user?.username} className="" />
            <div className="flex flex-col justify-center items-start">
              <p>{user?.username}</p>
              <p>{`Total Counter: ${user?.blogCount}`}</p>
            </div>
          </div>
        </Link>
      </CardBody>
    </Card>
  );
};

export default UserCard;
