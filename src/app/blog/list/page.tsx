"use client";

import {
  Article,
  fetchBlog,
  getRecentBlogs,
  getTrendingBlogs,
  IBlogCard,
} from "@/app/api";

import Layout from "@/components/layout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import BlogCard from "@/components/card/blogs";
import Button from "@/components/button/default";
import TrendBlogCard from "@/components/card/trendblogs";
import "swiper/css/navigation";
import { useAppContext } from "@/provider/AppProvider";

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

  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      const blogsData = await getTrendingBlogs(limit);
      if (blogsData) {
        setBlogs(blogsData);
      }
    };

    fetchTrendingBlogs();
  }, []);

  useEffect(() => {
    setDomLoaded(true);
    const fetchRecentData = async () => {
      setLoading(true);
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
      setLoading(false);
    };
    fetchRecentData();
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

            <div className="mt-10">
              {recentBlogsList?.length > 0 ? (
                <>
                  <p className="text-2xl text-center">Latest articles</p>
                  <div className="">
                    <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_360px)))] 2xl:grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_400px)))] grid-rows-[360px] 2xl:grid-rows-[400px] mydiv">
                      {recentBlogsList?.map((article, idx: number) => (
                        <BlogCard {...article} key={idx} />
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
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default BlogListPage;
