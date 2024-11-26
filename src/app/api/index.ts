import axiosInstance from "@/utils/axios";

export const statusText: { [key: number]: string } = {
  0: "Draft",
  1: "Collect",
  2: "Published",
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
    walletAddress: string;
    _id: string;
    collect?: Collector[]
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


export const uploadDataIrys = async (
  coverimage: string,
  title: string,
  content: string,
  keywords: string,
  walletaddress: string,
  status: number,
  bDelete: boolean
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
    console.error("Error uploading data:", error.response?.data || error.message);

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
    console.error("Error uploading image:", error.response?.data || error.message);

    // Return error message
    return { message: error.response?.data?.error || "Error uploading image" };
  }
};



