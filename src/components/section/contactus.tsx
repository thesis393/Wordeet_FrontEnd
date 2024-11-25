"use client"

import Link from "next/link"
import DefaultInput from "../input/input"
import SocialLink from "../link/social"
import { useState } from "react"
import { Textarea } from "@nextui-org/react"
import Button from "../button/default"

const ContactUs = () => {


  const socialLinks = [
    {
      title: "Twitter",
      href: "#",
      icon: "/assets/ico/ico_x.svg"
    },
    {
      title: "Tiktok",
      href: "#",
      icon: "/assets/ico/ico_tiktok.svg"
    },
    {
      title: "Facebook",
      href: "#",
      icon: "/assets/ico/ico_facebook.svg"
    },
    {
      title: "Instargram",
      href: "#",
      icon: "/assets/ico/ico_instagram.svg"
    },
  ]

  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")

  return (
    <div className="flex flex-row">
      <div className="video-container relative lg:h-[600px] rounded-xl">
        <video
          src="/assets/video/footer.mp4"
          autoPlay
          loop
          muted
          className="video rounded-xl"
        />
        <div className="basis-1/2 flex flex-col lg:absolute p-8 text-white bg-black bg-opacity-15 lg:bg-transparent backdrop-blur-sm shadow-xl rounded-xl lg:top-6 lg:bottom-6 lg:left-6 gap-2">
          <h3 className="text-3xl md:text-5xl capitalize text-white">Keep in touch</h3>
          <p className="text-sm sm:text-medium">Be The First to Get Our Weekly Updates, We Are Sure To Give You The Best. </p>
          <div className="flex flex-col gap-2 items-end">
            <DefaultInput value={email} onChange={setEmail} placeholder="example@gmail.com" radius="md" label="Email" type="email" />
            <Textarea
              value={content}
              onValueChange={setContent}
              label="Feedback"
              placeholder="Enter your feeling"
              className="w-full"
              classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "shadow-xl",
                  "bg-default-200/50",
                  "dark:bg-default/60",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  "hover:bg-default-200/70",
                  "dark:hover:bg-default/70",
                  "group-data-[focus=true]:bg-default-200/50",
                  "dark:group-data-[focus=true]:bg-default/60",
                  "!cursor-text",
                ],
              }}
            />
            <Button>send</Button>
          </div>
          <p className="text-lg">Feel free to reach out to us via <Link href={`mailto:wordit@wordit.com?subject=Hello&body=This is a message`} className="text-primary">
            support.wordit@tank.fm
          </Link></p>
          <div className="flex gap-2">
            {socialLinks.map((item, idx) => (
              <SocialLink href={item.href} icon={item.icon} alt={item.title} key={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs