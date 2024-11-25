"use client";

import Footer from "./footer";
import Navbar from "./navbar";

const WriteLayout = (props: any) => {
  const { children } = props;

  return (
    <main className="relative flex flex-col justify-center min-h-screen font-poppins">
      <div className="top-0 right-0 left-0 z-10 fixed bg-white opacity-100 shadow-lg">
        <Navbar />
      </div>
      <div className="flex flex-col flex-1 mx-auto px-4 sm:px-0 container">
        <div className="flex flex-col flex-1 justify-center mx-auto xl:w-10/12">
          {children}
        </div>
      </div>
      {/* <Footer /> */}
    </main>
  );
};

export default WriteLayout;
