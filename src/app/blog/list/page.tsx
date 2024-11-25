"use client";

import { Article, fetchBlog, getRecentBlogs, IBlogCard } from "@/app/api";
import Layout from "@/components/layout";
import { Image, Input } from "@nextui-org/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import ArticleCard from "@/components/card/article";
import BlogCard from "@/components/card/blogs";
import useScreenWidth from "@/utils/screen";
import Button from "@/components/button/default";
import TrendBlogCard from "@/components/card/trendblogs";
import "swiper/css/navigation";

const BlogListPage = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentBlogsList, setRecentBlogsList] = useState<IBlogCard[]>([]);
  const [totalBlogs, setTotalBlogs] = useState<number>(0);
  const [isViewMoreLoading, setIsViewMoreLoading] = useState<boolean>(false);

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
    fetchRecentData();
  }, []);

  const [blog, setBlog] = useState<any>();
  const params = useParams();
  const getViewMoreBlogs = async () => {
    try {
      setIsViewMoreLoading(true);
      const result = await getRecentBlogs(recentBlogsList.length, 3);
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

  const articles = [
    {
      title:
        "The Rise of DAOs: How Decentralized Autonomous Organizations Are Shaping the Future of Governance",
      content: `Definitely! 💪 achievements do a lot more than just embellishing your profile with fancy badges. They serve an important function in enhancing and illustrating your profile's credibility and engagement.

Firstly, achievements act as proof of your involvement and active contribution to GH. Potential collaborators can glance through your achievements and gauge your level of participation in the platform. This creates an immediate sense of trust and displays your dedication to growth and improvement within the realm of coding.

Secondly, these achievements also provide an insight into your areas of expertise and customs. For instance, an achievement for contributing to open-source projects shows your ability to collaborate effectively and contribute constructively. This signals to others that you are open to collaborations and that your work is of a certain standard, thus making your profile more valuable in the eyes of potential employers or partners.

Finally, achieving and displaying various achievements can help in personal branding. Be it a potential employer, collaborator, or any other viewer of your GH profile, these achievements serve as badges of your skill-set and adaptability, making your profile stand out.

So in a nutshell, GH achievments can significantly help your GH profile. They spotlight your expertise, commitment, and adaptability, giving you an edge. Therefore, knowing how to unlock achievements and correctly applying them can be a game-changer for those who wish to maximize their GH experience and opportunities.`,
      createdAt: "October 25, 2024",
      coverimage: "/assets/image/article/1.png",
      status: 1,
      walletaddress: "dkfjdkjfkejfe",
      _id: "dfkdjfke",
      author: {
        avatar: "/assets/image/avatar/1.jpg",
        username: "Renod Piggy",
        walletaddress: "dkfjdkjfkejfe",
        _id: "dfkdjfke",
      },
    },
    {
      title:
        "The Rise of DAOs: How Decentralized Autonomous Organizations Are Shaping the Future of Governance",
      content: `Definitely! 💪 achievements do a lot more than just embellishing your profile with fancy badges. They serve an important function in enhancing and illustrating your profile's credibility and engagement.

Firstly, achievements act as proof of your involvement and active contribution to GH. Potential collaborators can glance through your achievements and gauge your level of participation in the platform. This creates an immediate sense of trust and displays your dedication to growth and improvement within the realm of coding.

Secondly, these achievements also provide an insight into your areas of expertise and customs. For instance, an achievement for contributing to open-source projects shows your ability to collaborate effectively and contribute constructively. This signals to others that you are open to collaborations and that your work is of a certain standard, thus making your profile more valuable in the eyes of potential employers or partners.

Finally, achieving and displaying various achievements can help in personal branding. Be it a potential employer, collaborator, or any other viewer of your GH profile, these achievements serve as badges of your skill-set and adaptability, making your profile stand out.

So in a nutshell, GH achievments can significantly help your GH profile. They spotlight your expertise, commitment, and adaptability, giving you an edge. Therefore, knowing how to unlock achievements and correctly applying them can be a game-changer for those who wish to maximize their GH experience and opportunities.`,
      createdAt: "October 26, 2024",
      coverimage: "/assets/image/article/2.png",
      status: 1,
      walletaddress: "dkfjdkjfkejfe",
      _id: "dfkdjfke",
      author: {
        avatar: "/assets/image/avatar/1.jpg",
        username: "Denva Pijervest",
        walletaddress: "dkfjdkjfkejfe",
        _id: "dfkdjfke",
      },
    },
    {
      title: "How Zero-Knowledge Proofs Are Enhancing Privacy in Web3",
      content: `Definitely! 💪 achievements do a lot more than just embellishing your profile with fancy badges. They serve an important function in enhancing and illustrating your profile's credibility and engagement.

Firstly, achievements act as proof of your involvement and active contribution to GH. Potential collaborators can glance through your achievements and gauge your level of participation in the platform. This creates an immediate sense of trust and displays your dedication to growth and improvement within the realm of coding.

Secondly, these achievements also provide an insight into your areas of expertise and customs. For instance, an achievement for contributing to open-source projects shows your ability to collaborate effectively and contribute constructively. This signals to others that you are open to collaborations and that your work is of a certain standard, thus making your profile more valuable in the eyes of potential employers or partners.

Finally, achieving and displaying various achievements can help in personal branding. Be it a potential employer, collaborator, or any other viewer of your GH profile, these achievements serve as badges of your skill-set and adaptability, making your profile stand out.

So in a nutshell, GH achievments can significantly help your GH profile. They spotlight your expertise, commitment, and adaptability, giving you an edge. Therefore, knowing how to unlock achievements and correctly applying them can be a game-changer for those who wish to maximize their GH experience and opportunities.`,
      createdAt: "October 27, 2024",
      coverimage: "/assets/image/article/3.png",
      status: 1,
      walletaddress: "dkfjdkjfkejfe",
      _id: "dfkdjfke",
      author: {
        avatar: "/assets/image/avatar/1.jpg",
        username: "Daniel Repin",
        walletaddress: "dkfjdkjfkejfe",
        _id: "dfkdjfke",
      },
    },
    {
      title:
        "The Importance of Decentralized Storage in Web3: A Look at IPFS and Filecoin",
      content: `Definitely! 💪 achievements do a lot more than just embellishing your profile with fancy badges. They serve an important function in enhancing and illustrating your profile's credibility and engagement.

Firstly, achievements act as proof of your involvement and active contribution to GH. Potential collaborators can glance through your achievements and gauge your level of participation in the platform. This creates an immediate sense of trust and displays your dedication to growth and improvement within the realm of coding.

Secondly, these achievements also provide an insight into your areas of expertise and customs. For instance, an achievement for contributing to open-source projects shows your ability to collaborate effectively and contribute constructively. This signals to others that you are open to collaborations and that your work is of a certain standard, thus making your profile more valuable in the eyes of potential employers or partners.

Finally, achieving and displaying various achievements can help in personal branding. Be it a potential employer, collaborator, or any other viewer of your GH profile, these achievements serve as badges of your skill-set and adaptability, making your profile stand out.

So in a nutshell, GH achievments can significantly help your GH profile. They spotlight your expertise, commitment, and adaptability, giving you an edge. Therefore, knowing how to unlock achievements and correctly applying them can be a game-changer for those who wish to maximize their GH experience and opportunities.`,
      createdAt: "October 28, 2024",
      coverimage: "/assets/image/article/4.png",
      status: 1,
      walletaddress: "dkfjdkjfkejfe",
      _id: "dfkdjfke",
      author: {
        avatar: "/assets/image/avatar/1.jpg",
        username: "Powel Revanzi",
        walletaddress: "dkfjdkjfkejfe",
        _id: "dfkdjfke",
      },
    },
    {
      title:
        "The Role of Oracles in Web3: Bridging Real-World Data to the Blockchain",
      content: `Definitely! 💪 achievements do a lot more than just embellishing your profile with fancy badges. They serve an important function in enhancing and illustrating your profile's credibility and engagement.

Firstly, achievements act as proof of your involvement and active contribution to GH. Potential collaborators can glance through your achievements and gauge your level of participation in the platform. This creates an immediate sense of trust and displays your dedication to growth and improvement within the realm of coding.

Secondly, these achievements also provide an insight into your areas of expertise and customs. For instance, an achievement for contributing to open-source projects shows your ability to collaborate effectively and contribute constructively. This signals to others that you are open to collaborations and that your work is of a certain standard, thus making your profile more valuable in the eyes of potential employers or partners.

Finally, achieving and displaying various achievements can help in personal branding. Be it a potential employer, collaborator, or any other viewer of your GH profile, these achievements serve as badges of your skill-set and adaptability, making your profile stand out.

So in a nutshell, GH achievments can significantly help your GH profile. They spotlight your expertise, commitment, and adaptability, giving you an edge. Therefore, knowing how to unlock achievements and correctly applying them can be a game-changer for those who wish to maximize their GH experience and opportunities.`,
      createdAt: "October 29, 2024",
      coverimage: "/assets/image/article/5.png",
      status: 1,
      walletaddress: "dkfjdkjfkejfe",
      _id: "dfkdjfke",
      author: {
        avatar: "/assets/image/avatar/1.jpg",
        username: "Venzi Jami",
        walletaddress: "dkfjdkjfkejfe",
        _id: "dfkdjfke",
      },
    },
    {
      title:
        "Web3 and Gaming: How Blockchain Is Revolutionizing the Gaming Industry",
      content: `Definitely! 💪 achievements do a lot more than just embellishing your profile with fancy badges. They serve an important function in enhancing and illustrating your profile's credibility and engagement.

Firstly, achievements act as proof of your involvement and active contribution to GH. Potential collaborators can glance through your achievements and gauge your level of participation in the platform. This creates an immediate sense of trust and displays your dedication to growth and improvement within the realm of coding.

Secondly, these achievements also provide an insight into your areas of expertise and customs. For instance, an achievement for contributing to open-source projects shows your ability to collaborate effectively and contribute constructively. This signals to others that you are open to collaborations and that your work is of a certain standard, thus making your profile more valuable in the eyes of potential employers or partners.

Finally, achieving and displaying various achievements can help in personal branding. Be it a potential employer, collaborator, or any other viewer of your GH profile, these achievements serve as badges of your skill-set and adaptability, making your profile stand out.

So in a nutshell, GH achievments can significantly help your GH profile. They spotlight your expertise, commitment, and adaptability, giving you an edge. Therefore, knowing how to unlock achievements and correctly applying them can be a game-changer for those who wish to maximize their GH experience and opportunities.`,
      createdAt: "October 30, 2024",
      coverimage: "/assets/image/article/6.png",
      status: 1,
      walletaddress: "dkfjdkjfkejfe",
      _id: "dfkdjfke",
      author: {
        avatar: "/assets/image/avatar/1.jpg",
        username: "Alevendaria Kiteas",
        walletaddress: "dkfjdkjfkejfe",
        _id: "dfkdjfke",
      },
    },
  ];

  const screenWidth = useScreenWidth();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Layout>
        {domLoaded && (
          <div className="py-12 container">
            <div className="mt-4">
              <p className="text-2xl text-center"></p>
              <div className="mt-2">
                <Swiper
                  rewind={true}
                  navigation={true}
                  modules={[Navigation]}
                  className="trendBlog"
                >
                  <SwiperSlide>
                    <TrendBlogCard
                      title={articles[0].title}
                      content={articles[0].content}
                      createdAt={articles[0].createdAt}
                      coverimage={articles[0].coverimage}
                      _id={articles[0]._id}
                      author={articles[0].author}
                      status={articles[0].status}
                      walletaddress={articles[0].walletaddress}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <TrendBlogCard
                      title={articles[0].title}
                      content={articles[0].content}
                      createdAt={articles[0].createdAt}
                      coverimage={articles[0].coverimage}
                      _id={articles[0]._id}
                      author={articles[0].author}
                      status={articles[0].status}
                      walletaddress={articles[0].walletaddress}
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-xl">Latest articles</p>
              <div className="">
                <div className="justify-center gap-8 grid grid-cols-[repeat(auto-fill,_minmax(auto,_min(100%,_357px)))] grid-rows-[453px] mydiv">
                  {recentBlogsList.length &&
                    recentBlogsList.map((article, idx: number) => (
                      <BlogCard {...article} key={idx} />
                    ))}
                </div>
              </div>
              <div className="flex justify-center mt-5">
                {recentBlogsList.length < totalBlogs && (
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
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

// const Breadcrumb = () => {
//   return (
//     <div className="flex items-center">
//       <Link href="/blog/list" className="text-gray-500">
//         Blogs
//       </Link>
//       <span className="mx-2">/</span>
//       <span className="font-semibold">Billing</span>
//     </div>
//   );
// };

export default BlogListPage;
