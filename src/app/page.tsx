"use client"

import { useEffect, useState } from "react"
import Fireworks from "@/components/fireworks"
import TextAnimation from "@/components/text-animation"
import PosterReveal from "@/components/poster-reveal"

export default function ConcertPage() {
  const [showText, setShowText] = useState(false)
  const [showPoster, setShowPoster] = useState(false)

  useEffect(() => {
    // Start text animation after 3 seconds (after some fireworks have launched)
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 3000)

    // Show poster after text animation (approximately)
    const posterTimer = setTimeout(() => {
      setShowPoster(true)
    }, 8000)

    const disabledTextTimer = setTimeout(() => {
      setShowText(false)
    }, 8500)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(posterTimer)
      clearTimeout(disabledTextTimer)
    }
  }, [])

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <Fireworks />
      {showText && <TextAnimation />}
      {showPoster && <PosterReveal />}
    </main>
  )
}
