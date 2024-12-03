"use client";
import { MenuButton } from "@/components/button/menu";
import LandingFooter from "@/components/layout/landingfooter";
import { Metadata } from "next";
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
  Image,
} from "@nextui-org/react";
import { title } from "process";
import Button from "@/components/button/default";
import Link from "next/link";
import { motion, useScroll, Variants } from "framer-motion";
import Typewriter from "react-text-writer";
import { useEffect, useState } from "react";

export default function () {
  const defaultContent = "";

  const { scrollYProgress } = useScroll();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const cardVariants: Variants = {
    offscreen: {
      y: 300,
    },
    onscreen: {
      y: 50,
      rotate: -10,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const variants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
  };

  return (
    <>
      {domLoaded && (
        <div className="flex flex-col bg-[#1E1B4B] min-h-screen">
          {/* <motion.div
            className="z-20 h-1 progress-bar"
            style={{ scaleX: scrollYProgress }}
          /> */}
          <div className="flex flex-col bg-gradient-to-bl from-[#1E1B4B] from-20% via-[#2a2b69] via-30% to-[#1E1B4B] to-50%">
            <div className="relative flex justify-center items-center mx-auto px-4 md:px-10 pt-8 md:pt-20 container">
              <Image
                src="/assets/image/landing/chain.svg"
                className=""
                classNames={{
                  wrapper: "absolute left-0 top-0 right-0 !max-w-full",
                  img: "z-0 w-full",
                }}
              />
              <motion.div
                className="relative z-10 flex justify-between items-center bg-[#4338CA] px-4 py-2 rounded-2xl text-white"
                initial={{ width: 350 }}
                animate={{ width: "100%" }}
              >
                <h3 className="font-semibold text-2xl sm:text-3xl">Wordeet</h3>
                <Link href="/blog/list" className="">
                  <Button>Enter App</Button>
                </Link>
              </motion.div>
            </div>
            <div className="z-10 flex flex-col flex-1 justify-center items-center py-20 xl:py-36 2xl:py-48">
              <div className="flex flex-col mx-auto">
                <h1 className="font-bold text-4xl text-center text-white md:text-5xl lg:text-7xl 2xl:text-8xl italic">
                  {" "}
                  Beyond <span className="text-[#6366F1]">Writing</span>{" "}
                </h1>
                <Typewriter
                  text={[
                    "Empower your writing, fully own your words, and connect meaningfully with your community",
                    "Empower your writing, fully own your words, and connect meaningfully with your community",
                  ]}
                  speed={20}
                  loopDelay={10000}
                  textClassName="text-white text-center mt-8 text-xl"
                />
              </div>

              <div className="flex justify-center items-center bg-gradient-to-b from-[#210CFF] from-50% to-50% to-white shadow-[#210CFF] shadow-lg mx-auto mt-12 lg:mt-20 p-px rounded-xl">
                <Link href="/blog/list" className="">
                  <Button className="flex gap-2 scale-99">
                    Enter App
                    <Image src="/assets/ico/ico_arrow.svg" alt="arrow" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="z-10 flex justify-center items-center mx-auto p-4 container">
              <div className="flex md:flex-row flex-col gap-4 xl:w-4/5 2xl:2/3">
                <div className="flex sm:flex-row flex-col md:flex-col justify-between gap-4 basis-1/3">
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    transition={{ type: "linear" }}
                    className="flex justify-center items-center bg-[#4A6DFF] p-4 rounded-xl aspect-video basis-1/2 sm:aspect-square"
                  >
                    <p className="font-semibold text-center text-lg text-white">
                      Collect and
                      <br />
                      Own it
                    </p>
                  </motion.div>
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    transition={{ type: "linear" }}
                    className="flex justify-center items-center bg-[#C7D2FE] p-4 rounded-xl aspect-video basis-1/2 sm:aspect-square"
                  >
                    <p className="text-[#1E1E3D] text-center text-sm">
                      Build relationships, gather feedback, and grow your
                      influence organically in a supportive, decentralized
                      community.
                    </p>
                  </motion.div>
                </div>

                <div className="flex flex-col gap-2 aspect-square basis-2/3">
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    transition={{ type: "linear" }}
                    className="flex justify-center items-center bg-[#3730A3] p-6 rounded-xl w-full basis-1/3"
                  >
                    <p className="font-semibold text-center text-lg text-white">
                      Empower your voice with True Ownership
                    </p>
                  </motion.div>
                  <div className="flex gap-4 basis-1/3">
                    <motion.div
                      variants={variants}
                      initial="hidden"
                      animate="enter"
                      transition={{ type: "linear" }}
                      className="flex justify-center items-center bg-[#6366F1] my-2 p-4 rounded-xl basis-2/3"
                    >
                      <p className="text-center text-sm text-white">
                        Decentralized Publishing, Unrestricted Freedom
                      </p>
                    </motion.div>
                    <motion.div
                      variants={variants}
                      initial="hidden"
                      animate="enter"
                      transition={{ type: "linear" }}
                      className="flex justify-center items-center bg-[#4F46E5] my-2 p-4 rounded-xl basis-1/3"
                    >
                      <p className="font-semibold text-lg text-white">$WORD</p>
                    </motion.div>
                  </div>
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    transition={{ type: "linear" }}
                    className="flex justify-center items-center bg-[#3730A3] p-6 rounded-xl w-full basis-1/3"
                  >
                    <p className="font-semibold text-center text-lg text-white">
                      Connect Directly with Your Community
                    </p>
                  </motion.div>
                </div>
                <div></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-center items-center gap-32 mt-24">
            <section className="z-10 flex flex-col py-20 container">
              <div className="relative w-full xl:w-4/5 2xl:2/3 flex flex-col mx-auto py-20">
                <div className="top-0 bottom-0 absolute border-1 border-t-white border-r-0 border-b-white border-l-0 w-1/3">
                  {" "}
                </div>
                <div className="flex xl:flex-row flex-col text-white">
                  <h2 className="text-3xl text-center lg:text-4xl basis-1/2">
                    How wordeet works
                  </h2>
                  <p className="text-center text-xl basis-1/2">
                    Getting started on wordeet is simple and straightforward.
                  </p>
                </div>
                <div className="flex xl:flex-row flex-col gap-16 mx-auto py-10 lg:w-2/3 xl:w-full">
                  <div className="flex flex-col gap-8 pb-20 basis-1/2">
                    <div className="flex md:flex-row flex-col items-center gap-8">
                      <Image
                        src="/assets/image/landing/num1.svg"
                        width={200}
                        classNames={{ img: "rounded-none", wrapper: "p-1" }}
                        className="basis-1/4"
                      />
                      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#3730A3] to-[#1E1B4B] p-4 sm:p-8 md:p-16 rounded-xl text-center text-white aspect-square basis-3/4">
                        <Image
                          src="/assets/image/landing/ico_setup.svg"
                          alt="01"
                          classNames={{ img: "scale-80" }}
                        />
                        <h3 className="font-semibold text-xl">
                          Sign Up and Set Up Your Profile
                        </h3>
                        <p className="mt-6">
                          Begin by creating your account and customizing your
                          profile. This space reflects your unique voice and
                          connects you to an audience that values your work.
                        </p>
                      </div>
                    </div>
                    <div className="flex md:flex-row flex-col items-center gap-8">
                      <Image
                        src="/assets/image/landing/num2.svg"
                        width={200}
                        classNames={{ img: "rounded-none" }}
                        className="basis-1/4"
                      />
                      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#3730A3] to-[#1E1B4B] p-4 sm:p-8 md:p-16 rounded-xl text-center text-white aspect-square basis-3/4">
                        <Image
                          src="/assets/image/landing/ico_edit.svg"
                          alt="01"
                        />
                        <h3 className="font-semibold text-xl">
                          Create, Publish, and Tokenize Your Content
                        </h3>
                        <p className="mt-6">
                          Share your stories and ideas with ease. Publish
                          articles, essays, or creative pieces directly on
                          WORDIT, and take it a step further by tokenizing your
                          content as NFTs.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-8 pt-20 basis-1/2">
                    <div className="flex md:flex-row flex-col items-center gap-8">
                      <Image
                        src="/assets/image/landing/num3.svg"
                        width={200}
                        classNames={{ img: "rounded-none" }}
                        className="basis-1/4"
                      />
                      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#3730A3] to-[#1E1B4B] p-4 sm:p-8 md:p-16 rounded-xl text-center text-white aspect-square basis-3/4">
                        <Image
                          src="/assets/image/landing/ico_database.svg"
                          alt="01"
                        />
                        <h3 className="font-semibold text-xl">
                          Engage with Readers and Build Community
                        </h3>
                        <p className="mt-6">
                          Connect with a global audience through direct
                          engagement features. Receive feedback, build a loyal
                          following, and interact with readers who value your
                          voice and perspective.
                        </p>
                      </div>
                    </div>
                    <div className="flex md:flex-row flex-col items-center gap-8">
                      <Image
                        src="/assets/image/landing/num4.svg"
                        width={200}
                        classNames={{ img: "rounded-none" }}
                        className="basis-1/4"
                      />
                      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#3730A3] to-[#1E1B4B] p-4 sm:p-8 md:p-16 rounded-xl text-center text-white aspect-square basis-3/4">
                        <Image
                          src="/assets/image/landing/ico_setdown.svg"
                          alt="01"
                        />
                        <h3 className="font-semibold text-xl">
                          Earn Through Direct Rewards
                        </h3>
                        <p className="mt-6">
                          Your creativity has value—earn crypto rewards and
                          monetize your stories through tokenized content or
                          exclusive offerings. With every engagement, you grow
                          your presence and income on your terms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col justify-center items-center bg-gradient-to-b w-full text-white container">
              <Card className="w-full xl:w-4/5 2xl:2/3">
                <CardHeader className="bg-gradient-to-r from-[#3730A3] to-[#15123D] px-12 h-48">
                  <h2 className="text-3xl text-white lg:text-4xl">
                    wordeet - beyond writing
                  </h2>
                </CardHeader>
                <CardBody className="px-10 pt-8 pb-8 md:pb-12 xl:pb-16">
                  <p className="bg-clip-text bg-gradient-to-b from-black text-transparent text-xl leading-normal">
                    As part of the Web3 movement, WORDIT is not just another
                    platform; it’s a community-driven, decentralized space where
                    the future of storytelling unfolds. By removing barriers and
                    intermediaries, WORDIT enables creators to write, publish,
                    and earn in ways that reflect their unique voices and
                    visions. Here, your stories aren’t just shared—they’re
                    protected, valued, and celebrated, setting a new standard
                    for digital publishing on the Web3 internet.
                  </p>
                  <Link href="/blog/list" className="mx-auto mt-4">
                    <Button>Enter App</Button>
                  </Link>
                </CardBody>
              </Card>
            </section>

            <section className="z-20 bg-gradient-to-b from-[#1E1B4B] from-10% via-[#2a2b69] via-30% to-[#1E1B4B] to-50% mb-10 lg:mb-20 xl:mb-32 2xl:mb-64 w-full text-white">
              <div className="mx-auto container">
                <div className="mx-auto mb-12 lg:w-1/2">
                  <h2 className="first-line:font-semibold text-3xl text-center lg:text-4xl">
                    Frequently Asked Questions
                  </h2>
                  <p className="mt-2 sm:mt-4 text-center text-xl">
                    Here Is Everything You Need To Know About beWrite
                  </p>
                </div>
                <Accordion
                  className="w-full xl:w-4/5 2xl:2/3 mx-auto"
                  showDivider={false}
                >
                  <AccordionItem
                    key="1"
                    classNames={{
                      title: "text-white",
                      content: "text-white/40 px-8",
                    }}
                    className="text-white"
                    aria-label="What is wordeet"
                    title="What is wordeet, and how is it different from traditional blogging platforms?"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    classNames={{
                      title: "text-white",
                      content: "text-white/40 px-8",
                    }}
                    className="text-white"
                    aria-label="ownership"
                    title="How does content ownership work on wordeet?"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    classNames={{
                      title: "text-white",
                      content: "text-white/40 px-8",
                    }}
                    className="text-white"
                    aria-label="blockchain or crypto"
                    title="Do I need to know about blockchain or crypto to use wordeet?"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionItem>
                  <AccordionItem
                    key="4"
                    classNames={{
                      title: "text-white",
                      content: "text-white/40 px-8",
                    }}
                    className="text-white"
                    aria-label="audience"
                    title="How do I connect with my audience on wordeet?"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionItem>
                </Accordion>
              </div>
            </section>
          </div>
          <LandingFooter />
        </div>
      )}
    </>
  );
}
