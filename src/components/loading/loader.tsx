"use client";
import { useAppContext } from "@/provider/AppProvider";
import { Image } from "@nextui-org/react";

const Loader = () => {
  const { loading, status } = useAppContext();

  return (
    <div
      className={`top-0 right-0 bottom-0 left-0 z-50 fixed flex flex-col justify-center items-center backdrop-blur-lg w-100vw h-100vh ${
        loading ? "" : "hidden"
      }`}
    >
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/assets/ico/logo.svg"
          alt="logo"
          className="z-max animate-bounce"
          width={100}
          height={100}
        />
        <p>{status}</p>
      </div>
    </div>
  );
};

export default Loader;
