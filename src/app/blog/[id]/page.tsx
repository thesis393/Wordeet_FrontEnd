"use client";

import {
  Article,
  Article_,
  fetchBlog,
  getBlog,
  getClientBlogs,
  getRecentLimitBlogsExcludingUser,
  IBlogCard,
} from "@/app/api";
import Layout from "@/components/layout";
import { Avatar, AvatarGroup, Image, Input } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import ArticleCard from "@/components/card/article";
import BlogCard from "@/components/card/blogs";
import useScreenWidth from "@/utils/screen";
// import Button from "@/components/button/default";
import ClientBlogs from "@/components/card/clientblogs";
import CustomButton from "@/components/button/custombutton";
import ReadTipTap from "@/components/tiptap/readtiptap";
import { Bitcoin, CameraIcon, CoinsIcon, HandCoins } from "lucide-react";

const BlogPage = () => {
  const [blog, setBlog] = useState<Article_>();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientBlogs, setClientBlogs] = useState<IBlogCard[]>([]);
  const [otherBlogs, setOtherBlogs] = useState<IBlogCard[]>([]);

  const [walletaddress, setWalletAddress] = useState<string>("");
  const router = useRouter();

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
  };

  useEffect(() => {
    const fetchClientBlogs = async () => {
      setIsLoading(true);
      try {
        const result = await getClientBlogs(walletaddress, 2, blog?.blog?._id);
        setClientBlogs(result);
        const otherBlogsResult = await getRecentLimitBlogsExcludingUser(
          walletaddress,
          2
        );
        setOtherBlogs(otherBlogsResult);
      } catch (err: any) {
        setError(err.message || "Failed to fetch blogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientBlogs();
  }, [walletaddress]);

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const id = params.id;
      if (id !== undefined) {
        try {
          const result = await getBlog(id);
          if (result) {
            setBlog(result as Article_);
            setWalletAddress(result?.author?.walletaddress);
            console.log("User get blog", result);
          }
        } catch (error) {
          console.error("Error get blog", error);
        }
      }
    };
    if (params) {
      fetchData();
    }
  }, [params]);

  const screenWidth = useScreenWidth();

  return (
    <Layout>
      {blog && (
        <div className="py-12 w-11/12 container">
          <div>
            <Image
              alt={blog?.blog?.title}
              className="object-cover"
              height={200}
              shadow="md"
              // src={"/assets/image/article/sui-network.webp"}
              src={
                blog?.blog?.coverimage
                  ? `https://ipfs.io/ipfs/${blog?.blog?.coverimage}`
                  : "/assets/image/article/sui-network.webp"
              }
              width="100%"
            />
          </div>
          <h2 className="mt-4 text-2xl ms:text-3xl xl:text-4xl">
            {blog?.blog?.title}
          </h2>

          <div className="mt-2 text-lg leading-8">
            <ReadTipTap
              content={blog?.blog?.content}
              onChange={handleContentChange}
            />
          </div>

          <div className="flex flex-row justify-between mt-8">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${blog?.author?.walletaddress}`}
                  className="flex items-center gap-2"
                >
                  <Avatar
                    alt={blog?.author?.username}
                    className="rounded-full object-cover"
                    src={
                      blog?.author?.avatar
                        ? `https://ipfs.io/ipfs/${blog?.author?.avatar}`
                        : "https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    }
                    size="lg"
                    isBordered
                    color="success"
                  />
                  <p className="text-lg">{blog?.author?.username}</p>
                </Link>
              </div>
              <Button
                color="default"
                variant="ghost"
                size="sm"
                startContent={<CoinsIcon />}
              >
                tip
              </Button>
            </div>
            <div>
              <Button className="text-right bg-primary shadow-lg text-white">
                Collect
              </Button>
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <AvatarGroup
              isBordered
              max={5}
              total={blog?.blog?.collect?.length}
              renderCount={(count) => (
                <p className="font-medium text-foreground text-small ms-2">
                  {count} Collected
                </p>
              )}
            >
              {blog?.blog?.collect?.map((item: any, idx: number) => (
                <Avatar src={item?.avatar} key={idx} />
              ))}
            </AvatarGroup>
          </div>

          <div className="mt-32">
            <p className="text-2xl text-center">
              Subscribe to {blog?.author?.username}
            </p>
            <div className="flex justify-center mt-3">
              <div className="flex justify-center items-center border-gray-300 border rounded rounded-xl w-full max-w-md overflow-hidden">
                <input
                  type="email"
                  placeholder={blog?.author?.username}
                  className="flex-1 px-4 py-2 w-full text-gray-700 focus:outline-none"
                />
                <CustomButton
                  style={"purple"}
                  className="flex-1 rounded-none rounded-r-xl"
                >
                  Submit
                </CustomButton>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex justify-between items-center felx-row">
              <p className="text-2xl">
                Check Out More Articles By {blog?.author?.username}
              </p>
              <div
                className="text-4xl text-primary cursor-pointer"
                onClick={() => {
                  router.push(`/profile/${walletaddress}`);
                }}
              >
                View All
              </div>
            </div>
            <div className="">
              <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_480px)))] grid-rows-[453px] mydiv">
                {clientBlogs.map((article, idx: number) => (
                  <ClientBlogs {...article} key={idx} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex flex-row justify-between cursor-pointer">
              <p className="text-2xl">More Articles from Different Writes</p>
              <div
                className="text-4xl text-primary"
                onClick={() => {
                  router.push(`/blog/list`);
                }}
              >
                View All
              </div>
            </div>
            <div className="">
              <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_357px)))] grid-rows-[453px] mydiv">
                {otherBlogs.map((article, idx: number) => (
                  <BlogCard {...article} key={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const Breadcrumb = () => {
  return (
    <div className="flex items-center">
      <Link href="/blog/list" className="text-gray-500">
        Blogs
      </Link>
      <span className="mx-2">/</span>
      <span className="font-semibold">Billing</span>
    </div>
  );
};

export default BlogPage;
