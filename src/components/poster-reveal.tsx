"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function PosterReveal() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      <motion.div
        className="relative w-[80vw] max-w-md aspect-[3/4] rounded-lg overflow-hidden shadow-2xl"
        initial={{ scale: 0.8, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          duration: 1.2,
          type: "spring",
          bounce: 0.4,
        }}
      >
        <Image
          src="/raleuk-to-the-moon.jpg"
          alt="RALEUK TO THE MOON CONCERT"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
        <motion.div
          className="inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.button
            className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border-2 border-white/50 font-semibold"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            GET TICKETS
          </motion.button>
        </motion.div>
    </motion.div>
  )
}
