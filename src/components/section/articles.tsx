import ArticleCard from "../card/article"

const ArticlesSection = () => {

  const articles = [
    {
      title: "The Rise of DAOs: How Decentralized Autonomous Organizations Are Shaping the Future of Governance",
      content: "",
      createdAt: "October 25, 2024",
      image: "/assets/image/article/1.png",
      id: "",
    },
    {
      title: "The Rise of DAOs: How Decentralized Autonomous Organizations Are Shaping the Future of Governance",
      content: "",
      createdAt: "October 26, 2024",
      image: "/assets/image/article/2.png",
      id: "",
    },
    {
      title: "How Zero-Knowledge Proofs Are Enhancing Privacy in Web3",
      content: "",
      createdAt: "October 27, 2024",
      image: "/assets/image/article/3.png",
      id: "",
    },
    {
      title: "The Importance of Decentralized Storage in Web3: A Look at IPFS and Filecoin",
      content: "",
      createdAt: "October 28, 2024",
      image: "/assets/image/article/4.png",
      id: "",
    },
    {
      title: "The Role of Oracles in Web3: Bridging Real-World Data to the Blockchain",
      content: "",
      createdAt: "October 29, 2024",
      image: "/assets/image/article/5.png",
      id: "",
    },
    {
      title: "Web3 and Gaming: How Blockchain Is Revolutionizing the Gaming Industry",
      content: "",
      createdAt: "October 30, 2024",
      image: "/assets/image/article/6.png",
      id: "",
    },
  ]

  return (
    <div>
      <div className="flex flex-col items-center w-full mt-12">
        <h2 className="text-4xl text-center">Featured Articles</h2>
        <p className="opacity-60 text-center mt-2">Stay Up To Date With The Latest Information About Our Latest Article Updates</p>
      </div>
      <div className="flex flex-wrap p-4 gap-4 items-center justify-center mt-4">
        {
          articles.map((article, idx) => (
            <ArticleCard {...article} key={idx} />
          ))
        }
      </div>
    </div>
  )
}


export default ArticlesSection