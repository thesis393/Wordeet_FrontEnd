"use client";
import Button from "@/components/button/default";
import TrandingCard from "@/components/card/tranding";
import DefaultInput from "@/components/input/input";
import Layout from "@/components/layout";
import SocialLink from "@/components/link/social";
import ArticlesSection from "@/components/section/articles";
import ContactUs from "@/components/section/contactus";
import TrandingSection from "@/components/section/tranding";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "HomePage",
  description: "Wordit home page.",
};

export default function Home() {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  return (
    <>
      {domLoaded && (
        <Layout>
          <div className="flex flex-col items-center gap-4 mt-12 py-8 w-full">
            <div className="relative z-0 flex flex-col justify-center items-center mx-auto w-11/12 xl:w-2/3 2xl:w-1/2">
              <p className="z-10 text-4xl text-black text-center xl:text-5xl 2xl:text-7xl">
                Unlock{" "}
                <span className="z-10 text-center text-primary">Potential</span>{" "}
                Stories On Web3
              </p>
              <Image
                src={`/assets/image/decoration.svg`}
                alt="decoration"
                width={200}
                height={50}
                className="bottom-0 left-0 z-0 absolute -mb-8"
              />
              <Image
                src={`/assets/image/decoration.svg`}
                alt="decoration"
                width={200}
                height={50}
                className="right-0 bottom-0 z-0 absolute -mb-8 scale-x-[-1]"
              />
            </div>
            <p className="w-2/3 xl:w-1/2 2xl:w-1/3 text-center">
              {" "}
              Wordit is a modern Web3 blogging platform designed for creators to
              Like, share their ideas and stories in a decentralized and open
              environment.
            </p>
            <Button>Get Started</Button>
          </div>

          <div className="flex flex-col items-center mt-12 w-full">
            <h2 className="text-4xl text-center">About Our Blog</h2>
            <p className="opacity-60">
              Stay Up To Date With The Latest Information About Our Latest
              Article Updates
            </p>
          </div>

          <div className="flex flex-col gap-10 mx-auto mt-10 px-2 xl:w-10/12 2xl:w-8/12">
            <div className="flex sm:flex-row flex-col gap-10">
              <div className="relative flex sm:flex-row flex-col-reverse items-center sm:items-start bg-gradient-to-t from-[#4A6DFF] to-[#1C1B1F] p-4 xl:p-8 2xl:p-14 rounded-2xl basis-2/3">
                <div className="flex flex-col items-center sm:items-start space-y-2 sm:space-y-4 sm:w-1/2">
                  <p className="text-center text-white sm:text-start">
                    Stay up to date with real-time notifications for new
                    published content.
                  </p>
                  <Button style="light">Sign Up For Free</Button>
                </div>
                <Image
                  src={`/assets/image/home/1.png`}
                  alt="nft"
                  width={200}
                  height={200}
                  className="right-0 bottom-0 sm:absolute"
                />
              </div>
              <div className="flex items-end bg-[url('/assets/image/home/2.png')] bg-cover bg-center p-8 rounded-xl sm:w-auto min-h-60 basis-1/3">
                <p className="text-white">
                  Explore and licence contents as NFTs
                </p>
              </div>
            </div>

            <div className="flex sm:flex-row flex-col gap-10">
              <div className="flex flex-1 justify-end items-end bg-[url('/assets/image/home/3.png')] p-8 rounded-xl min-h-60 sm:min-h-0">
                <p className="text-white sm:text-xl">
                  Japanese Web3 Infrastructure Firm KEKKAI Rebrands as Alpha
                  Network, Focuses on Decentralized AI Solutions.
                </p>
              </div>
              <div className="flex flex-col flex-1 gap-10">
                <div className="flex bg-[url('/assets/image/home/4.jpeg')] bg-opacity-40 bg-cover bg-center rounded-xl min-h-60">
                  <div className="flex flex-1 justify-start items-start bg-opacity-30 backdrop-blur-md p-8 rounded-xl w-full">
                    <div className="flex flex-col items-end gap-4">
                      <p className="text-start text-white">
                        Post your own story and save it forever! some thing like
                        this fantastic article sentence. too short? then add
                        some more sentences for good looks
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex bg-[url('/assets/image/home/5.png')] bg-cover bg-center rounded-xl min-h-60">
                  <div className="flex flex-1 justify-end items-end bg-opacity-30 backdrop-blur-md p-8 rounded-xl w-full">
                    <div className="flex flex-col items-end gap-4">
                      <p className="text-end text-white">
                        Invite your friends to WordIT and earn tokens for each
                        successful referral or promotion you make
                      </p>
                      <Button style="light">Connect Wallet</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TrandingSection />
          <ArticlesSection />
          <ContactUs />
        </Layout>
      )}
    </>
  );
}
