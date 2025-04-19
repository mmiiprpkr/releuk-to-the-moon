"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";

export default function SingerSelection() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const imagesTop = isDesktop ? images.slice(0, 3) : images.slice(0, 2);
  const imagesBottom = isDesktop ? images.slice(3) : images.slice(2);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="flex flex-col">
        <div className="flex gap-3 md:gap-6 justify-center flex-wrap">
          {imagesTop.map((image, index) => (
            <motion.div
              key={index}
              className="relative w-[150px] h-[200px] md:w-[250px] md:h-[320px]"
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
        <div className="flex gap-3 mt-3 md:gap-6 md:mt-6 justify-center flex-wrap">
          {imagesBottom.map((image, index) => (
            <motion.div
              key={index}
              className="relative w-[150px] h-[200px] md:w-[250px] md:h-[320px]"
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
