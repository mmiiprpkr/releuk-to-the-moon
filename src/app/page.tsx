"use client";

import { useEffect, useState } from "react";
import Fireworks from "@/components/fireworks";
import TextAnimation from "@/components/text-animation";
import PosterReveal from "@/components/poster-reveal";
import SingerSelection from "@/components/signer-selection";

export default function ConcertPage() {
  const [showText, setShowText] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [showSigner, setShowSinger] = useState(false);

  useEffect(() => {
    // Start text animation after 3 seconds (after some fireworks have launched)
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 3000);

    // Hide text and poster after a certain duration
    const disabledTextTimer = setTimeout(() => {
      setShowText(false);
    }, 8500);

    const singerTimer = setTimeout(() => {
      setShowSinger(true);
    }, 9000);

    // hide singer
    const disabledSingerTimer = setTimeout(() => {
      setShowSinger(false);
    }, 12000);

    // Show poster after text animation (approximately)
    const posterTimer = setTimeout(() => {
      setShowPoster(true);
    }, 12000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(posterTimer);
      clearTimeout(disabledTextTimer);
      clearTimeout(singerTimer);
      clearTimeout(disabledSingerTimer);
    };
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <Fireworks />
      {showText && <TextAnimation />}
      {showPoster && <PosterReveal />}
      {showSigner && <SingerSelection />}
    </main>
  );
}
