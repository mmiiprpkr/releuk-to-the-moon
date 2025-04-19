"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SingerSelection() {
  const images = [
    "/sing1.jpg",
    "/sing2.jpg",
    "/sing3.jpg",
    "/sing4.jpg",
    "/sing5.jpg",
  ];

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.5,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col">
        <div className="flex gap-x-6 justify-center">
          {images.slice(0, 3).map((image, index) => (
            <motion.div
              key={index}
              className="relative w-[250px] h-[320px]"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <Image
                src={image}
                alt="Singer image"
                fill
                className="absolute object-contain rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-shadow duration-300"
              />
            </motion.div>
          ))}
        </div>
        <div className="flex gap-6 justify-center mt-6">
          {images.slice(3, 5).map((image, index) => (
            <motion.div
              key={index}
              className="relative w-[250px] h-[320px]"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              custom={index + 3}
            >
              <Image
                src={image}
                alt="Singer image"
                fill
                className="absolute object-contain rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-shadow duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
