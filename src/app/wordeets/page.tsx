"use client";
import UserCard from "@/components/card/user";
import Layout from "@/components/layout";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { getTopCreators, getTrendingBlogs } from "../api";
import BlogCard from "@/components/card/blogs";
import { useAppContext } from "@/provider/AppProvider";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function Wordeets() {
  const [blogs, setBlogs] = useState<any[]>([]); // Array to store blogs
  const [limit, setLimit] = useState<number>(12); // Default limit
  const [topUsers, setTopUsers] = useState<any[]>([]); // Array to store blogs
  const [limitTop, setTopLimit] = useState<number>(12); // Default limit
  const { setLoading } = useAppContext();

  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      setLoading(true);
      const blogsData = await getTrendingBlogs(limit);
      if (blogsData) {
        setBlogs(blogsData);
      }
      setLoading(false);
    };

    fetchTrendingBlogs();
  }, []);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const usersData = await getTopCreators(limit);
      if (usersData) {
        console.log("setTopUsers");
        setTopUsers(usersData);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <Layout>
      <div className="justify-center mt-4 w-full">
        <p className="mt-12 font-medium text-2xl text-center">Top Users</p>
        <div className="justify-center gap-4 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_360px)))] 2xl:grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_400px)))] grid-rows-[70px] mt-2">
          {topUsers.map((user, idx) => (
            <UserCard user={user} key={idx} />
          ))}
        </div>
      </div>
      <div className="justify-center mt-10 w-full">
        <p className="mt-12 font-medium text-2xl text-center">Top Blogs</p>
        <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_360px)))] 2xl:grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_400px)))] grid-rows-[400px] mydiv">
          {blogs.map((blog: any, idx: number) => (
            <BlogCard
              title={blog?.title}
              content={blog.content}
              createdAt={blog.createdAt}
              coverimage={blog.coverimage}
              _id={blog._id}
              author={blog.author}
              status={blog.status}
              walletaddress={blog.walletaddress}
              collectorInfos={blog.collectorInfos}
              nTotalCollecter={blog.nTotalCollecter}
              key={idx}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
