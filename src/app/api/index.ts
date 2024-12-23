import axiosInstance from "@/utils/axios";

export const statusText: { [key: number]: string } = {
  0: "Draft",
  1: "Collect",
  2: "Collect",
};

export interface IBlogCard {
  title: string;
  content: string;
  coverimage: string;
  createdAt: string;
  status: number;
  bDelete?: boolean;
  keywords?: string;
  updatedAt?: string;
  walletaddress: string;
  _id: string;
  author: {
    avatar: string;
    username: string;
    _id?: string;
    walletaddress?: string;
  };
  nftCollectionAddress?: string;
  nTotalCollecter?: number;
  collectorInfos?: Array<{
    avatar: string;
    username: string;
    _id?: string;
    walletaddress: string;
    nftMintAddress: string;
  }>;
}

export interface INewBlogCard {
  _id: string;
  authorAddress: string;
  username: string;
  coverimage: string;
  category: string;
  title: string;
  content: string;
  upvote: number;
  downvote: number;
  walletaddress: string;
  nftcollectionaddress: string;
  ntotalcollector: number;
  lowercaseTitle: string;
  status: number;
  createdAt: number;
}

export interface IBlogResponse {
  blogs: IBlogCard[];
  totalCount: number;
}


export interface Article {
  title: string;
  content: string;
  createdAt: string;
  _id: string;
  author: {
    avatar: string;
    name: string;
    _id: string;
  },
  collect?: Collector[]
}

export interface CollectorInfo {
  avatar: string;
  username: string;
  walletaddress: string;
  nftMintAddress: string;
  _id: string;
}

export interface NewArticle {
  _id: string,
  owner: string,
  username: string,
  coverimage: string,
  category: string,
  createdAt: number,
  title: string,
  content: string,
  upvote: number,
  downvote: number,
  keywords: string,
  walletaddress: string,
  nftcollectionaddress: string,
  ntotalcollector: number,
}

export interface Article_ {
  blog: {
    bDelete: string;
    coverimage: string;
    keywords: string;
    status: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    walletaddress: string;
    _id: string;
    collect?: Collector[];
    nTotalCollecter?: number;
    collectorInfos?: CollectorInfo[];
    nftCollectionAddress?: string;
  },
  author: {
    avatar: string;
    bio: string;
    createdAt: string;
    externallink: string;
    twitterlink: string;
    updateAt: string;
    username: string;
    walletaddress: string;
    _id: string;
  }
}

export interface Collector {
  avatar: string;
  name: string;
  _id: string;
}

export const fetchTranding = async (): Promise<Article> => {
  const data: Article = {
    _id: "tranding id",
    title: `The Ethereum Merge: What It Means for the Future of Blockchain and Sustainability`,
    content: `The Ethereum Merge, which took place in 2022, marked a monumental shift in the blockchain world. By transitioning from the energy-intensive Proof of Work (PoW) consensus mechanism to the more eco-friendly Proof of Stake (PoS), Ethereum reduced its energy consumption by over 99%, making it one of the greenest blockchains today. This upgrade is significant not just for Ethereum, but for the entire blockchain ecosystem. It addresses one of the biggest criticisms of cryptocurrencies—environmental sustainability—by making the network far less reliant on massive computational power. The Merge also paves the way for Ethereum 2.0, which promises enhanced scalability and security, positioning Ethereum as the go-to platform for decentralized applications (dApps), NFTs, and DeFi projects.`,
    createdAt: `10/27 2024`,
    author: {
      avatar: '/assets/image/avatar/1.jpg',
      _id: "author id",
      name: "Denis Lordrigo",
    },
    collect: [
      {
        avatar: "/assets/image/avatar/1.jpg",
        name: "babo1",
        _id: "",
      },
    ]
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1500);
  });
};


export const fetchBlog = async (id: string | string[]) => {
  const blog = {
    title: "The Ethereum Merge: What It Means for the Future of Blockchain and Sustainability",
    content: `The Ethereum Merge, which took place in 2022, marked a monumental shift in the blockchain world. By transitioning from the energy-intensive Proof of Work (PoW) consensus mechanism to the more eco-friendly Proof of Stake (PoS), Ethereum reduced its energy consumption by over 99%, making it one of the greenest blockchains today. 
    Bitcoin, the world’s most famous cryptocurrency, has transformed how we think about money, decentralization, and financial freedom. However, it’s also raised pressing concerns about sustainability. As the global conversation shifts toward greener practices and environmental responsibility, one question lingers: can Bitcoin mining, often criticized for its high energy consumption, become more sustainable? With innovations in renewable energy and more eco-friendly mining practices on the rise, the future may not be as grim as it seems. Let’s dive into the current state of Bitcoin mining, its environmental impact, and the exciting potential of green mining to reshape the landscape.
    A sustainable Bitcoin future is more than a possibility—it’s a necessity. As environmental awareness grows and regulations tighten, the crypto industry is being pushed toward greener solutions. Here are some reasons to be optimistic about the future of Bitcoin mining:
    The Shift to Renewable Energy: As renewable energy continues to become more accessible and cost-effective, the shift from fossil fuels to clean energy in mining will accelerate. Some countries, like El Salvador, are even exploring the use of volcanic energy to power their Bitcoin mining operations.
    Carbon Neutral Initiatives: Some companies are working toward carbon neutrality in the crypto space. Projects like Crypto Climate Accord aim to make the entire crypto industry carbon neutral by 2030. These initiatives are important steps toward mitigating the environmental impact of Bitcoin mining.
    The Growth of Proof-of-Stake (PoS) Alternatives: While Bitcoin will likely always rely on its energy-intensive proof-of-work system, the rise of other cryptocurrencies utilizing proof-of-stake (PoS) models offers an alternative path forward. PoS requires significantly less energy to secure a network and validate transactions, and it’s gaining popularity with projects like Ethereum transitioning to PoS (via Ethereum 2.0).
    `,
    createdAt: "10/28 2024",
    author: {
      name: "Eujin Pezerbest",
      avatar: "/assets/image/avatar/1.jpg",
    },
    collect: [
      {
        avatar: "/assets/image/avatar/1.jpg",
        name: "babo1",
        _id: "",
      },
      {
        avatar: "/assets/image/avatar/1.jpg",
        name: "babo2",
        _id: "",
      },
      {
        avatar: "/assets/image/avatar/1.jpg",
        name: "babo3",
        _id: "",
      },
      {
        avatar: "/assets/image/avatar/1.jpg",
        name: "babo4",
        _id: "",
      },
      {
        avatar: "/assets/image/avatar/1.jpg",
        name: "babo5",
        _id: "",
      },
      {
        avatar: "/assets/image/avatar/1.jpg",
        name: "babo6",
        _id: "",
      },
    ],
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(blog as Article);
    }, 1500);
  });
}



export const createUser = async (avatar: String, username: String, walletaddress: String, twitterlink: String, externallink: String, bio: String) => {
  try {
    console.log("User create start ");

    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/user/create`, {
      avatar: avatar,
      username: username,
      walletaddress: walletaddress,
      twitterlink: twitterlink,
      externallink: externallink,
      bio: bio
    })
    console.log("User create response ", response.data);
    return response.data
  } catch (error: any) {
    return {
      status: "createUser failed",
      message: error?.data?.message
    }
  }
}

export const updateUser = async (avatar: String, username: String, walletaddress: String, twitterlink: String, externallink: String, bio: String) => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/user/update`, {
      avatar: avatar,
      username: username,
      walletaddress: walletaddress,
      twitterlink: twitterlink,
      externallink: externallink,
      bio: bio
    })
    return response.data
  } catch (error: any) {
    return {
      status: "updateUser failed",
      message: error?.data?.message
    }
  }

}

export const readUser = async (walletaddress: String) => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/user/read`, {
      walletaddress: walletaddress
    })
    return response.data
  } catch (error: any) {
    return {
      status: "readuser failed",
      message: error?.data?.message
    }
  }
}

export const postBlog = async (coverimage: String, title: String, content: String, keywords: String, walletaddress: String, status: Number, bDelete: Boolean) => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/post`, {
      coverimage: coverimage,
      title: title,
      content: content,
      keywords: keywords,
      walletaddress: walletaddress,
      status: status,
      bDelete: bDelete
    })
    console.log("Post Blog response ", response.data);
    return response.data
  } catch (error: any) {
    return {
      status: "postBlog failed",
      message: error?.data?.message
    }
  }
}

export const getBlog = async (id: any) => {
  try {
    console.log("getBlog: id", id);
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/read`, {
      id: id
    })
    console.log("getBlog get response", response.data)
    return response.data
  } catch (error: any) {
    return {
      status: "getBlog failed",
      message: error?.data?.message
    }
  }

}

export const updateBlog = async (id: String, coverimage: String, title: String, content: String, keywords: String, walletaddress: String, status: Number, bDelete: Boolean) => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/update`, {
      id: id,
      coverimage: coverimage,
      title: title,
      content: content,
      keywords: keywords,
      walletaddress: walletaddress,
      status: status,
      bDelete: bDelete
    })
    console.log("Update Blog response ", response.data);
    return response.data
  } catch (error: any) {
    return {
      status: "updateBlog failed",
      message: error?.data?.message
    }
  }
}

export const deleteBlog = async (id: Number, walletaddress: String, bDelete: boolean) => {
  const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/delete`, {
    id: id,
    walletaddress: walletaddress,
    bDelete: bDelete
  })
  return response.data
}

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
};

export const formatUnixTimestampToDate = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  const year = date.getFullYear(); // Full year (e.g., 2023)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0'); // Day of the month
  return `${year}.${month}.${day}`;
};

export const getRecentBlogs = async (skip: number, limit: number): Promise<IBlogResponse> => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/recent`, { skip, limit });
    console.log("Recent blog response", response.data);
    return response.data as IBlogResponse;
  } catch (error: any) {
    console.log('Error recent blogs:', error.response?.data || error.message);
    const result = {};
    return result as IBlogResponse;
  }
};

export const getClientBlogs = async (walletaddress: string, limit: number, excludeBlogId?: string): Promise<IBlogCard[]> => {
  try {
    // Prepare the request payload
    const payload: any = { walletaddress, limit };

    if (excludeBlogId) {
      payload.excludeBlogId = excludeBlogId;
    }

    // Send the request to the server
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/recentlimitclient`, payload);

    console.log("getClientBlogs success");
    // Return the blogs as an array of IBlogCard objects
    return response.data.blogs as IBlogCard[];
  } catch (error: any) {
    console.log('Error fetching client blogs:', error.response?.data || error.message);

    // Return an empty array in case of error
    return [] as IBlogCard[];
  }
};


export const getRecentLimitBlogsExcludingUser = async (walletaddress: string, limit: number): Promise<IBlogCard[]> => {
  try {
    // Prepare the request payload
    const payload = { walletaddress, limit };

    // Send the request to the server
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/recentlimitexcludeuser`, payload);

    // Return the blogs as an array of IBlogCard objects
    return response.data.blogs as IBlogCard[];
  } catch (error: any) {
    console.log('Error fetching blogs excluding user blogs:', error.response?.data || error.message);

    // Return an empty array in case of error
    return [] as IBlogCard[];
  }
};

export const signVerify = async (
  verifyData: any
): Promise<{ bVerify: boolean; message: string }> => {
  try {
    // Serialize blogData as a JSON string
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/upload/verify`,
      { data: JSON.stringify(verifyData) }, // Send serialized data
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the uploaded data URL
    return {
      bVerify: response.data.bVerify,
      message: "Verify successfully",
    };
  } catch (error: any) {
    console.log("Error uploading data:", error.response?.data || error.message);
    // Return error message
    return { bVerify: false, message: error.response?.data?.error || "Error uploading data" };
  }
};


export const uploadDataIrys = async (
  coverimage: string,
  title: string,
  content: string,
  keywords: string,
  walletaddress: string,
  status: number,
  bDelete: boolean,
  blogData: any
): Promise<{ url?: string; message: string }> => {
  try {
    const payload = {
      coverimage,
      title,
      content,
      keywords,
      walletaddress,
      status,
      bDelete,
      blogData,
    };

    // Serialize payload as a JSON string
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/upload/upload`,
      { data: JSON.stringify(payload) }, // Send serialized data
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the uploaded data URL
    return {
      url: response.data.url,
      message: "Data uploaded successfully",
    };
  } catch (error: any) {
    console.log("Error uploading data:", error.response?.data || error.message);

    // Return error message
    return { message: error.response?.data?.error || "Error uploading data" };
  }
};

export const fundWallet = async (): Promise<{ transactionId?: string; message: string }> => {
  try {
    // Prepare the request payload (if needed, here it is empty)
    const payload = {};

    // Send the request to the server
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/upload/fund`, payload);

    // Return success message and transaction ID
    return {
      transactionId: response.data.transactionId,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Error funding wallet:", error.response?.data || error.message);

    // Return error message
    return { message: error.response?.data.error || "Error funding wallet" };
  }
};

// Function to upload an image
export const uploadImageFile = async (file: File): Promise<{ url?: string; message: string }> => {
  try {
    // Prepare the file in a FormData object
    const formData = new FormData();
    formData.append("image", file);

    // Send the file to the backend
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/upload/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Return the URL of the uploaded image
    return {
      url: response.data.url,
      message: response.data.message,
    };
  } catch (error: any) {
    console.log("Error uploading image:", error.response?.data || error.message);

    // Return error message
    return { message: error.response?.data?.error || "Error uploading image" };
  }
};


export const uploadSingleDataIrys = async (
  singleData: any
): Promise<{ url: string; message: string }> => {
  try {
    // Serialize payload as a JSON string
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/upload/singleupload`,
      { data: JSON.stringify(singleData) }, // Send serialized data
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the uploaded data URL
    return {
      url: response.data.url,
      message: "Data uploaded successfully",
    };
  } catch (error: any) {
    console.log("Error uploading data:", error.response?.data || error.message);

    // Return error message
    return { url: "", message: error.response?.data?.error || "Error uploading data" };
  }
};


//NFT
export const getBlogNFTCollectionAddress = async (blogId: string): Promise<string | null> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/blog/getNFTCollectionAddress`,
      { blogId }
    );

    console.log('Fetched NFT Collection Address:', response.data.nftCollectionAddress);
    // Return the address
    return response.data.nftCollectionAddress;
  } catch (error: any) {
    console.error('Error fetching NFT collection address:', error.response?.data || error.message);

    // Return null in case of an error
    return null;
  }
};

export const updateBlogNFTCollectionAddress = async (
  blogId: string,
  nftCollectionAddress: string
): Promise<boolean> => {
  try {
    // Send the POST request
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/blog/updateNFTCollectionAddress`,
      { blogId, nftCollectionAddress }
    );

    console.log('Update Response:', response.data);
    return true; // Return success
  } catch (error: any) {
    console.log('Error updating NFT collection address:', error.response?.data || error.message);
    return false; // Return failure
  }
};


export const addCollector = async (blogId: string, collectorInfo: any) => {
  try {
    console.log("addCollection")
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/addCollectorInfo`, {
      blogId,
      collectorInfo,
    });

    console.log('Collector added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding collector info:', error);
    return null;
  }
};

export const getTrendingBlogs = async (limit: number) => {
  try {
    console.log('Fetching trending blogs...');
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/getTrendingBlogs`, {
      limit,
    });

    console.log('Trending blogs fetched successfully:', response.data);
    return response.data.blogs; // Assuming the response contains a 'blogs' array
  } catch (error) {
    console.error('Error fetching trending blogs:', error);
    return null;
  }
};

export const getTopCreators = async (limit: number) => {
  try {
    console.log('Fetching top creators...');

    // Send POST request to fetch the top creators
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/blog/getTopCreators`, {
      limit,
    });

    console.log('Top creators fetched successfully:', response.data);
    return response.data.topCreators; // Assuming the response contains a 'creators' array
  } catch (error) {
    console.error('Error fetching top creators:', error);
    return null; // In case of an error, return null or handle error appropriately
  }
};

export const searchBlogsByText = async (searchText: string) => {
  try {
    console.log(`Searching blogs with text: "${searchText}"`);

    // Send POST request to fetch matching blogs
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/blog/searchBlogs`,
      { searchText }
    );

    console.log("Blogs fetched successfully:", response.data);
    return response.data.blogs; // Assuming the response contains a 'blogs' array
  } catch (error) {
    console.error("Error searching blogs:", error);
    return null; // Return null or handle error appropriately
  }
};
