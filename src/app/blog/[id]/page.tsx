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
import { Avatar, AvatarGroup, Card, Image, Input } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import ArticleCard from "@/components/card/article";
import BlogCard from "@/components/card/wideblogs";
import useScreenWidth from "@/utils/screen";
import ClientBlogs from "@/components/card/clientblogs";
import CustomButton from "@/components/button/custombutton";
import ReadTipTap from "@/components/tiptap/readtiptap";
import { Bitcoin, CameraIcon, CoinsIcon, HandCoins } from "lucide-react";
import TipModal from "@/components/modal/tipmodal";

const BlogPage = () => {
  const [blog, setBlog] = useState<Article_>();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientBlogs, setClientBlogs] = useState<IBlogCard[]>([]);
  const [otherBlogs, setOtherBlogs] = useState<IBlogCard[]>([]);

  const [walletaddress, setWalletAddress] = useState<string>("");
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  // Function to open Tip modal
  const openTipModal = () => {
    console.log("openTipModal start");
    setIsTipModalOpen(true);
  };

  const closeTipModal = () => {
    console.log("closeTipModal");
    setIsTipModalOpen(false);
  };

  const router = useRouter();

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
  };

  useEffect(() => {
    const fetchClientBlogs = async () => {
      setIsLoading(true);

      try {
        console.log("ddd", blog?.blog?.walletaddress);
        if (blog?.blog?.walletaddress) {
          console.log("ddd", blog?.blog?.walletaddress);

          const result = await getClientBlogs(
            blog?.blog?.walletaddress,
            2,
            blog?.blog?._id
          );
          setClientBlogs(result);
          console.log("getClientBlogs", result);
          const otherBlogsResult = await getRecentLimitBlogsExcludingUser(
            blog?.blog?.walletaddress,
            2
          );
          setOtherBlogs(otherBlogsResult);
        }
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
                  ? `${blog?.blog?.coverimage}`
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
                        ? `${blog?.author?.avatar}`
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
                onClick={openTipModal}
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
              total={blog?.blog?.nTotalCollecter}
              renderCount={(count) => (
                <p className="font-medium text-foreground text-small ms-2">
                  {count} Collected
                </p>
              )}
            >
              {blog?.blog?.collectorInfos?.map((item: any, idx: number) => (
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
          <div className="flex flex-col gap-8 mt-6">
            <Card>
              <div className="flex sm:flex-row flex-col justify-between items-center p-4">
                <div>
                  <p className="text-xl">Subscribe to Social Graph Ventures</p>
                  <p>Receive the latest updates directly to your inbox</p>
                </div>
              </div>
            </Card>
            <div className="flex md:flex-row flex-col gap-8">
              <Card className="p-4 basis-1/2">
                <div className="flex flex-col items-center gap-8">
                  <Image
                    src={
                      blog?.blog?.coverimage
                        ? blog?.blog?.coverimage
                        : `/assets/image/article/6.png`
                    }
                    alt=""
                    width={200}
                    height={200}
                  />
                  <div className="flex flex-col items-center gap-4">
                    <p>
                      Mint this entry as an NFT to add it to your collection.
                    </p>
                    <Button>Mint</Button>
                    <AvatarGroup
                      isBordered
                      max={5}
                      total={blog?.blog?.nTotalCollecter}
                      renderCount={(count) => (
                        <p className="font-medium text-foreground text-small ms-2">
                          {count} Collected
                        </p>
                      )}
                    >
                      {blog?.blog?.collectorInfos?.map(
                        (item: any, idx: number) => (
                          <Link
                            href={`/profile/${item.walletaddress}`}
                            key={idx}
                          >
                            <Avatar src={item?.avatar} size="sm" />
                          </Link>
                        )
                      )}
                    </AvatarGroup>
                  </div>
                </div>
              </Card>
              <Card className="flex flex-col p-8 basis-1/2">
                <div className="flex flex-1">
                  <p>Verification</p>
                  <p>
                    This entry has been permanently stored onchain and signed by
                    its creator.
                  </p>
                </div>
                <div className="border-gray-900 border rounded-xl divide-y-1 divide-gray-900">
                  <div className="flex flex-col px-3 py-1">
                    <p className="text-xs uppercase">arweave transaction</p>
                    <p className="text-sm">asdf9oasdfasdfasdfasghasdfasdfa</p>
                  </div>
                  {blog?.blog?.nftCollectionAddress ? (
                    <div className="flex flex-col px-3 py-1">
                      <p className="text-xs uppercase">NFT Address</p>
                      <p className="text-sm">
                        {blog?.blog?.nftCollectionAddress}
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                  {blog?.blog?.walletaddress ? (
                    <div className="flex flex-col px-3 py-1">
                      <p className="text-xs uppercase">AUTHOR ADDRESS</p>
                      <p className="text-sm">{blog?.blog?.walletaddress}</p>
                    </div>
                  ) : (
                    <></>
                  )}
                  {blog?.blog?._id ? (
                    <div className="flex flex-col px-3 py-1">
                      <p className="text-xs uppercase">Content Digest</p>
                      <p className="text-sm">{blog?.blog?._id}</p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Card>
            </div>
          </div>
          <div className="mt-10">
            {clientBlogs?.length ? (
              <>
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
              </>
            ) : (
              <></>
            )}
          </div>

          <div className="mt-10">
            {otherBlogs?.length ? (
              <>
                <div className="flex flex-row justify-between cursor-pointer">
                  <p className="text-2xl">
                    More Articles from Different Writes
                  </p>
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
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
      <TipModal
        isOpen={isTipModalOpen}
        onClose={closeTipModal}
        DesPubKey={walletaddress}
      />
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
