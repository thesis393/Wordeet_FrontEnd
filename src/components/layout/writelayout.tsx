"use client";

import Footer from "./footer";
import Navbar from "./navbar";

const WriteLayout = (props: any) => {
  const { children } = props;

  return (
    <main className="flex flex-col h-screen overflow-hidden light">
      <div className="top-0 z-10 sticky bg-white opacity-100 shadow-lg">
        <Navbar />
      </div>
      <div className="mx-auto px-2 md:px-10 xl:px-20 2xl:max-w-screen-2xl xl:max-w-screen-xl writer-container">
        {children}
      </div>
    </main>
  );
};

export default WriteLayout;
