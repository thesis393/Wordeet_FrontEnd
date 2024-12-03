"use client";

import Footer from "./footer";
import Navbar from "./navbar";

const Layout = (props: any) => {
  const { children } = props;

  return (
    <main className="flex flex-col justify-center min-h-screen font-poppins">
      <div className="bg-white shadow-lg">
        <Navbar />
      </div>
      <div className="flex-1 mx-auto px-4 sm:px-0 w-full">
        <div className="flex flex-col justify-center items-center mx-auto xl:w-11/12 2xl:w-10/12">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
