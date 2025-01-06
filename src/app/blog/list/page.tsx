"use client";

import {
  Article,
  fetchBlog,
  getDataFromIrys,
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
import useProgram from "@/app/anchor/config";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSearchInfo } from "@/provider/SearchInfoProvider";
import {
  Pagination as Pagination2,
  PaginationItem,
  PaginationCursor,
} from "@nextui-org/react";

const BlogListPage = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [recentBlogsList, setRecentBlogsList] = useState<IBlogCard[]>([]);
  const [recentBlogsList, setRecentBlogsList] = useState<any[]>([]);
  const [totalBlogs, setTotalBlogs] = useState<number>(0);
  const [isViewMoreLoading, setIsViewMoreLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<any[]>([]); // Array to store blogs
  const [limit, setLimit] = useState<number>(5); // Default limit
  const { setLoading } = useAppContext();
  const [topUsers, setTopUsers] = useState<any[]>([]); // Array to store blogs
  const [nLimitRecentBlogs, setLimitRecentBlogs] = useState<number>(5);
  const [nLimitTrendBlogs, setLimitTrendBlogs] = useState<number>(5);
  const [nLimitTopUsers, setLimitTopUsers] = useState<number>(5);
  const [allBlogsList, setAllBlogsList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentBlogs, setCurrentBlogs] = useState<any[]>([]);

  const { publicKey } = useWallet();
  const { searchInfo } = useSearchInfo();

  const program = useProgram();

  useEffect(() => {
    // Set the initial blogs when the component mounts or when recentBlogsList changes
    pageChange(1); // Start with page 1
  }, [recentBlogsList]);

  useEffect(() => {
    setDomLoaded(true);

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
              category: account.category, // Updated to use fetched data
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
          .slice(0, nLimitTrendBlogs);

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
          .slice(0, nLimitTopUsers);

        setTotalBlogs(sortedBlogs.length);
        setAllBlogsList(sortedBlogs);
        setRecentBlogsList(sortedBlogs);
        setBlogs(trendBlogs);
        setTopUsers(formattedUsers);
        console.log("Total Blogs Count:", sortedBlogs.length);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    // setLoading(true);
    fetchBlogs();
    // setLoading(false);

    //Backend Way
    // const fetchRecentData = async () => {
    //   try {
    //     const result = await getRecentBlogs(0, 12);
    //     console.log("fetchRecentData", result);
    //     setRecentBlogsList(result.blogs); // Set blogs list
    //     setTotalBlogs(result.totalCount); // Set total blogs count
    //   } catch (err: any) {
    //     setError(err.message || "Failed to fetch blogs");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // const fetchTrendingBlogs = async () => {
    //   const blogsData = await getTrendingBlogs(limit);
    //   if (blogsData) {
    //     setBlogs(blogsData);
    //   }
    // };
    // const fetchTopUsers = async () => {
    //   console.log("wordeets getTopCreators start");
    //   const usersData = await getTopCreators(limit);
    //   if (usersData) {
    //     console.log("setTopUsers");
    //     setTopUsers(usersData);
    //   }
    // };

    // setLoading(true);
    // fetchTrendingBlogs();
    // fetchRecentData();
    // fetchTopUsers();
    // setLoading(false);
  }, []);

  useEffect(() => {
    console.log(
      "selectedCategory: ",
      selectedCategory,
      "searchInfo: ",
      searchInfo
    );
    const filteredPosts = allBlogsList.filter(
      (post) =>
        (selectedCategory === "all" || post.category === selectedCategory) &&
        (!searchInfo ||
          post.title?.toLowerCase().includes(searchInfo?.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchInfo?.toLowerCase()))
    );

    console.log("filteredPosts", filteredPosts);
    setRecentBlogsList(filteredPosts);
  }, [selectedCategory, searchInfo]);

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

  const pageChange = (page: number) => {
    console.log("pageChange : " + page);

    // Calculate the start and end indices for slicing the recentBlogsList
    const itemsPerPage = 3;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the blogs based on the current page
    const slicedBlogs = recentBlogsList.slice(startIndex, endIndex);

    // Update the state with the sliced blogs
    setCurrentBlogs(slicedBlogs);
  };

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
                      <TrendBlogCard {...blog} key={idx} />
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </div>
            <div className="flex flex-col gap-10 mt-10">
              <p className="text-2xl text-start">Popular Categories</p>
              <div className="items-center gap-4 xl:gap-8 grid grid-cols-3 md:grid-cols-6">
                <CategoryButton
                  className="bg-pink-200"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </CategoryButton>
                <CategoryButton
                  className="bg-green-200"
                  onClick={() => setSelectedCategory("de-fi")}
                >
                  DeFi
                </CategoryButton>
                <CategoryButton
                  className="bg-purple-200"
                  onClick={() => setSelectedCategory("de-pin")}
                >
                  DePin
                </CategoryButton>
                <CategoryButton
                  className="bg-blue-200"
                  onClick={() => setSelectedCategory("de-sci")}
                >
                  DeSci
                </CategoryButton>
                <CategoryButton
                  className="bg-orange-200"
                  onClick={() => setSelectedCategory("dao")}
                >
                  DAO
                </CategoryButton>
                <CategoryButton
                  className="bg-yellow-200"
                  onClick={() => setSelectedCategory("nft")}
                >
                  NFT
                </CategoryButton>
              </div>
            </div>

            <div className="flex lg:flex-row gap-8 mt-10">
              <div className="lg:flex-shrink-0 lg:basis-2/3">
                {currentBlogs.length > 0 ? (
                  <>
                    <p className="text-2xl text-start">Recent Posts</p>
                    <div className="mt-10">
                      <div className="flex flex-col gap-8">
                        {currentBlogs.map((article, idx: number) => (
                          <TrendBlogCard {...article} key={idx} />
                        ))}
                      </div>
                    </div>
                    <Pagination2
                      className="mt-10"
                      loop
                      showControls
                      color="success"
                      initialPage={1}
                      total={Math.ceil(recentBlogsList.length / 3)}
                      onChange={(page: number) => pageChange(page)}
                    />
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
                    {/* <div className="flex justify-center mt-5">
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
                    </div> */}
                  </>
                ) : (
                  <></>
                )}
                <div className="mt-10">
                  <p className="text-2xl text-start">Categories</p>
                  <div className="items-center gap-4 xl:gap-8 grid grid-cols-3 mt-10">
                    <CategoryButton
                      className="bg-pink-200"
                      onClick={() => setSelectedCategory("all")}
                    >
                      All
                    </CategoryButton>
                    <CategoryButton
                      className="bg-green-200"
                      onClick={() => setSelectedCategory("de-fi")}
                    >
                      DeFi
                    </CategoryButton>
                    <CategoryButton
                      className="bg-purple-200"
                      onClick={() => setSelectedCategory("de-pin")}
                    >
                      DePin
                    </CategoryButton>
                    <CategoryButton
                      className="bg-blue-200"
                      onClick={() => setSelectedCategory("de-sci")}
                    >
                      DeSci
                    </CategoryButton>
                    <CategoryButton
                      className="bg-orange-200"
                      onClick={() => setSelectedCategory("dao")}
                    >
                      DAO
                    </CategoryButton>
                    <CategoryButton
                      className="bg-yellow-200"
                      onClick={() => setSelectedCategory("nft")}
                    >
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
