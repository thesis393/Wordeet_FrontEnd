"use client";
import UserCard from "@/components/card/user";
import Layout from "@/components/layout";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { getDataFromIrys, getTopCreators, getTrendingBlogs } from "../api";
import BlogCard from "@/components/card/blogs";
import { useAppContext } from "@/provider/AppProvider";
import { faL } from "@fortawesome/free-solid-svg-icons";
import useProgram from "../anchor/config";

export default function Wordeets() {
  const [blogs, setBlogs] = useState<any[]>([]); // Array to store blogs
  const [limit, setLimit] = useState<number>(12); // Default limit
  const [topUsers, setTopUsers] = useState<any[]>([]); // Array to store blogs
  const [limitTop, setTopLimit] = useState<number>(12); // Default limit
  const { setLoading } = useAppContext();
  const program = useProgram();

  //SmartContract Way
  useEffect(() => {
    //SmartContract Way
    const fetchBlogs = async () => {
      try {
        if (!program) return;
        const allBlogs = await program.account.blogPost.all();

        // Map blog data to formatted posts
        const formattedBlogs = await Promise.all(
          allBlogs.map(async ({ publicKey, account }) => {
            const irysResponse = await getDataFromIrys(`${account.content}`);
            const content = irysResponse?.data?.content || account.content; // Use fetched content or fallback to original

            return {
              _id: publicKey.toString(),
              authorAddress: account.owner.toString(),
              username: account.username,
              coverimage: account.coverimage,
              category: account.category,
              createdAt: account.createdAt,
              title: account.title,
              content: content,
              upvote: account.upvote,
              downvote: account.downvote,
              walletaddress: account.walletaddress,
              nftcollectionaddress: account.nftcollectionaddress,
              ntotalcollector: account.ntotalcollecter,
              status: 1,
              lowercaseTitle: account.title.replace(/\s+/g, "-").toLowerCase(),
            };
          })
        );

        // Sort blogs by creation date
        const sortedBlogs = formattedBlogs.sort(
          (a, b) => b.createdAt - a.createdAt
        );

        const trendBlogs = formattedBlogs
          .slice()
          .sort((a, b) => b.upvote - a.upvote)
          .slice(0, limit);

        const allUsers = await program.account.userProfile.all();
        const formattedUsers = allUsers.map(({ publicKey, account }) => ({
          _id: publicKey.toString(),
          username: account.username,
          blogCount: account.postCount,
          walletaddress: account.walletaddress,
          avatar: account.avatar,
        }));

        const topUsers = formattedUsers
          .slice()
          .sort((a, b) => b.blogCount - a.blogCount)
          .slice(0, limit);

        setBlogs(trendBlogs);
        setTopUsers(topUsers);
        console.log("Total Blogs Count:", sortedBlogs.length);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    // setLoading(true);
    fetchBlogs();
    // setLoading(false);
  }, []);

  //Backend Way
  // useEffect(() => {
  //   const fetchTrendingBlogs = async () => {
  //     console.log("wordeets getTrendingBlogs start");
  //     const blogsData = await getTrendingBlogs(limit);
  //     if (blogsData) {
  //       setBlogs(blogsData);
  //     }
  //   };
  //   const fetchTopUsers = async () => {
  //     console.log("wordeets getTopCreators start");
  //     const usersData = await getTopCreators(limit);
  //     if (usersData) {
  //       console.log("setTopUsers");
  //       setTopUsers(usersData);
  //     }
  //   };

  //   setLoading(true);
  //   fetchTrendingBlogs();
  //   fetchTopUsers();
  //   setLoading(false);
  // }, []);

  return (
    <Layout>
      <div className="justify-center mt-4 w-full">
        {topUsers?.length > 0 ? (
          <>
            {" "}
            <p className="mt-12 font-medium text-2xl text-center">Top Users</p>
            <div className="justify-center gap-4 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_360px)))] 2xl:grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_400px)))] grid-rows-[70px] mt-2">
              {topUsers.map((user, idx) => (
                <UserCard user={user} key={idx} />
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="justify-center mt-10 w-full">
        {blogs?.length > 0 ? (
          <>
            <p className="mt-12 font-medium text-2xl text-center">Top Blogs</p>
            <div className="justify-center gap-4 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_360px)))] 2xl:grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_400px)))] grid-rows-[400px] mydiv">
              {blogs.map((blog: any, idx: number) => (
                <BlogCard {...blog} key={idx} />
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
}
