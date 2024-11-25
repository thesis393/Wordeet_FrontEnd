'use client'
import { motion } from "framer-motion"

const Button = (props: any) => {
  const { children, className, onClick, style = "purple" } = props;

  return (
    <motion.button whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
      className={`${className} w-fit capitalize hover:scale-101 active:scale-99 ${style === "purple"
          ? "bg-primary text-white hover:bg-primary-600 active:bg-primary-500"
          : "bg-white text-primary hover:bg-primary-200 active:bg-primary-100"
        } flex gap-2  rounded-xl h-fit shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] px-8 py-3 cursor-pointer items-center justify-center`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default Button;
