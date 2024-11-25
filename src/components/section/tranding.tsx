import ArticleCard from "../card/article"
import TrandingCard from "../card/tranding"

const TrandingSection = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center w-full mt-12">
        <h2 className="text-4xl text-center">Trending Now</h2>
        <p className="opacity-60 text-center mt-2">Stay Up To Date With The Latest Information About Our Latest Article Updates</p>
      </div>
      <div className="flex flex-col mt-10 xl:w-10/12 2xl:w-8/12 mx-auto gap-10 px-2 ">
        <TrandingCard />
      </div>
    </div>
  )
}


export default TrandingSection