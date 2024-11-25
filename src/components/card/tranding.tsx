'use client'

import { Article, fetchTranding } from "@/app/api";
import { Card, CardBody, CardFooter, CardHeader, Image } from "@nextui-org/react"
import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const TrandingCard = () => {

  const [article, setArticle] = useState<Article | null>()

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchTranding()
      if (result) {
        setArticle(result)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="rounded-xl shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)]">
      <div className={`rounded-t-xl flex-col items-start ${article ? "bg-[url('/assets/image/article/header.jpg')]" : ""} px-8 py-10 bg-opacity-10 bg-cover bg-no-repeat`}>
        {article ? <h4 className="font-bold text-lg text-white xl:text-3xl 2xl:text-4xl "><Link href={`/blog/${article._id}`}>{article?.title}</Link></h4> : <Skeleton />}
        {article && <div className="flex w-full items-center justify-between mt-4">
          <div className="flex gap-2 items-center">
            <Image
              className="object-cover rounded-full"
              src={article?.author.avatar!!} alt={article?.author.name!!}
              width={50}
            />
            <p className="text-white">{article.author.name}</p>
          </div>
          <p className="shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] rounded-lg bg-dark bg-opacity-35 text-end text-white px-4 py-1 backdrop-blur-sm">{article?.createdAt}</p>
        </div>}
      </div>
      <div className="px-4 sm:px-10 py-8">
        {article ?
          <p className="text-sm sm:text-lg">
            {article?.content}
          </p>
          :
          <Skeleton count={5} />
        }
      </div>
    </div>
  )
}


export default TrandingCard