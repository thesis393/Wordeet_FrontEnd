"use client";
import { motion } from "framer-motion";

const CategoryButton = (props: any) => {
  const { children, className, onClick, style = "purple" } = props;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${className} w-fit capitalize hover:scale-101 active:scale-99 flex gap-2  rounded-xl h-fit shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] min-w-[80px] py-3 cursor-pointer items-center w-full justify-center`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default CategoryButton;
