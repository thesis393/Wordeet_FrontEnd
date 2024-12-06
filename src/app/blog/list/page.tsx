"use client";

import {
  Article,
  fetchBlog,
  getRecentBlogs,
  getTopCreators,
  getTrendingBlogs,
  IBlogCard,
} from "@/app/api";

import Layout from "@/components/layout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import WideBlogCard from "@/components/card/wideblogs";
import Button from "@/components/button/default";
import TrendBlogCard from "@/components/card/trendblogs";
import "swiper/css/navigation";
import { useAppContext } from "@/provider/AppProvider";
import { faL } from "@fortawesome/free-solid-svg-icons";
import CategoryButton from "@/components/button/categorybtn";
import PopularBlogCard from "@/components/card/popularblogs";
import UserCard from "@/components/card/user";
import TopCreaterCard from "@/components/card/topcreater";

const BlogListPage = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentBlogsList, setRecentBlogsList] = useState<IBlogCard[]>([]);
  const [totalBlogs, setTotalBlogs] = useState<number>(0);
  const [isViewMoreLoading, setIsViewMoreLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<any[]>([]); // Array to store blogs
  const [limit, setLimit] = useState<number>(5); // Default limit
  const { setLoading } = useAppContext();
  const [topUsers, setTopUsers] = useState<any[]>([]); // Array to store blogs

  useEffect(() => {
    setDomLoaded(true);
    const fetchRecentData = async () => {
      try {
        const result = await getRecentBlogs(0, 12);
        console.log("fetchRecentData", result);
        setRecentBlogsList(result.blogs); // Set blogs list
        setTotalBlogs(result.totalCount); // Set total blogs count
      } catch (err: any) {
        setError(err.message || "Failed to fetch blogs");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchTrendingBlogs = async () => {
      const blogsData = await getTrendingBlogs(limit);
      if (blogsData) {
        setBlogs(blogsData);
      }
    };
    const fetchTopUsers = async () => {
      console.log("wordeets getTopCreators start");
      const usersData = await getTopCreators(limit);
      if (usersData) {
        console.log("setTopUsers");
        setTopUsers(usersData);
      }
    };

    setLoading(true);
    fetchTrendingBlogs();
    fetchRecentData();
    fetchTopUsers();
    setLoading(false);
  }, []);

  const [blog, setBlog] = useState<any>();
  const params = useParams();
  const swiper = useSwiper();
  const getViewMoreBlogs = async () => {
    try {
      setIsViewMoreLoading(true);
      const result = await getRecentBlogs(recentBlogsList.length, 12);
      console.log("fetchRecentData", result);

      // Append the new blogs to the existing list
      setRecentBlogsList((prevBlogs) => [...prevBlogs, ...result.blogs]);

      // Update the total blogs count
      setTotalBlogs(result.totalCount);
    } catch (err: any) {
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setIsViewMoreLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const id = params.id;
      if (id !== undefined) {
        const result = await fetchBlog(id);
        if (result) setBlog(result);
      }
    };
    if (params) {
      fetchData();
    }
  }, [params]);

  return (
    <>
      <Layout>
        {domLoaded && (
          <div className="flex flex-col py-12 w-full">
            <div className="mt-2">
              <Swiper
                pagination={{
                  dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="trendBlog"
              >
                {blogs?.length === 0 ? (
                  <></>
                ) : (
                  blogs?.map((blog: any, idx: number) => (
                    <SwiperSlide key={idx}>
                      <TrendBlogCard
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
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </div>
            <div className="flex flex-col gap-10 mt-10">
              <p className="text-2xl text-start">Popular Categories</p>
              <div className="items-center gap-4 xl:gap-8 grid grid-cols-3 md:grid-cols-6">
                <CategoryButton className="bg-pink-200">All</CategoryButton>
                <CategoryButton className="bg-green-200">DeFi</CategoryButton>
                <CategoryButton className="bg-purple-200">DePin</CategoryButton>
                <CategoryButton className="bg-blue-200">DeSci</CategoryButton>
                <CategoryButton className="bg-orange-200">DAO</CategoryButton>
                <CategoryButton className="bg-yellow-200">NFT</CategoryButton>
              </div>
            </div>

            <div className="flex lg:flex-row gap-8 mt-10">
              <div className="lg:basis-2/3 lg:flex-shrink-0">
                {recentBlogsList?.length > 0 ? (
                  <>
                    <p className="text-2xl text-start">Recent Posts</p>
                    <div className="mt-10">
                      <div className="flex flex-col gap-8">
                        {recentBlogsList?.map((article, idx: number) => (
                          <WideBlogCard {...article} key={idx} />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="lg:flex flex-col hidden lg:basis-1/3">
                {recentBlogsList?.length > 0 ? (
                  <>
                    <p className="text-2xl text-start">Most Popular</p>
                    <div className="mt-10">
                      <div className="flex gap-8 grid felx-col">
                        {blogs?.map((article, idx: number) => (
                          <PopularBlogCard {...article} key={idx} />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center mt-5">
                      {recentBlogsList?.length < totalBlogs && (
                        <Button
                          onClick={getViewMoreBlogs}
                          style={"white"}
                          className="mt-2"
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "View More"}
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="mt-10">
                  <p className="text-2xl text-start">Categories</p>
                  <div className="items-center gap-4 xl:gap-8 grid grid-cols-3 mt-10">
                    <CategoryButton className="bg-pink-200">All</CategoryButton>
                    <CategoryButton className="bg-green-200">
                      DeFi
                    </CategoryButton>
                    <CategoryButton className="bg-purple-200">
                      DePin
                    </CategoryButton>
                    <CategoryButton className="bg-blue-200">
                      DeSci
                    </CategoryButton>
                    <CategoryButton className="bg-orange-200">
                      DAO
                    </CategoryButton>
                    <CategoryButton className="bg-yellow-200">
                      NFT
                    </CategoryButton>
                  </div>
                </div>
                <div className="mt-10">
                  <p className="text-2xl text-start">Top Creaters</p>
                  <div className="flex flex-col gap-5 mt-10">
                    {topUsers.map((user, idx) => (
                      <TopCreaterCard user={user} key={idx} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default BlogListPage;
