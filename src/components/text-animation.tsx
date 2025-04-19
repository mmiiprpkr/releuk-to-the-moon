"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type DotPattern = (0 | 1)[][];

interface Dot {
  letterIndex: number;
  row: number;
  col: number;
}

// Letter patterns type
const letterPatterns: Record<string, DotPattern> = {
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  K: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  C: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  " ": [[0], [0], [0], [0], [0]],
};

export default function DotMatrixAnimation() {
  const [displayedLetters, setDisplayedLetters] = useState<number[]>([]);
  const [displayedDots, setDisplayedDots] = useState<Dot[]>([]);
  const [animationDuration] = useState<number>(5);
  const animationStartTime = useRef<number | null>(null);
  const totalDotsCount = useRef<number>(0);
  const completedDotsCount = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);

  const text = "RALEUK TO THE MOON CONCERT";
  const letters = text.split("");

  useEffect(() => {
    let totalDots = 0;
    for (const letter of letters) {
      const pattern = letterPatterns[letter] || letterPatterns[" "];
      for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
          if (pattern[row][col] === 1) {
            totalDots++;
          }
        }
      }
    }
    totalDotsCount.current = totalDots;

    // Reset animation state when component mounts
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [letters]);

  useEffect(() => {
    if (animationStartTime.current === null) {
      animationStartTime.current = performance.now();
    }

    const animate = (currentTime: number) => {
      if (!animationStartTime.current) return;

      const elapsedTime = (currentTime - animationStartTime.current) / 1000; // Convert to seconds
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const targetDots = Math.floor(progress * totalDotsCount.current);

      if (completedDotsCount.current < targetDots) {
        const newDots: Dot[] = [];
        let newLetters: number[] = Array.from(new Set([...displayedLetters]));

        while (completedDotsCount.current < targetDots) {
          let dotCount = 0;
          let foundNextDot = false;

          for (
            let letterIndex = 0;
            letterIndex < letters.length;
            letterIndex++
          ) {
            const letter = letters[letterIndex];
            const pattern = letterPatterns[letter] || letterPatterns[" "];

            for (let row = 0; row < pattern.length; row++) {
              for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                  dotCount++;

                  if (dotCount > completedDotsCount.current) {
                    completedDotsCount.current++;

                    if (!displayedLetters.includes(letterIndex)) {
                      newLetters = [
                        ...Array.from(
                          new Set([...displayedLetters, letterIndex])
                        ),
                      ];
                    }

                    newDots.push({ letterIndex, row, col });
                    foundNextDot = true;
                    break;
                  }
                }
              }
              if (foundNextDot) break;
            }
            if (foundNextDot) break;
          }
        }

        if (newDots.length > 0) {
          setDisplayedDots((prev) => [...prev, ...newDots]);
          setDisplayedLetters(newLetters);
        }
      }

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animationDuration, letters, displayedLetters]);

  // กำหนดขนาดของ dot และระยะห่าง (ปรับให้เล็กลง)
  const dotSize = 6;
  const dotSpacing = 8;
  const letterSpacing = 2; // ระยะห่างระหว่างตัวอักษร (หน่วยเป็นช่อง)

  // คำนวณความกว้างของแต่ละตัวอักษร
  const getLetterWidth = (letter: string) => {
    const pattern = letterPatterns[letter] || letterPatterns[" "];
    return pattern[0].length * dotSpacing;
  };

  // คำนวณความกว้างทั้งหมดของข้อความ
  const calculateTotalWidth = () => {
    let totalWidth = 0;
    letters.forEach((letter, index) => {
      totalWidth += getLetterWidth(letter);
      if (index < letters.length - 1) {
        totalWidth += letterSpacing * dotSpacing;
      }
    });
    return totalWidth;
  };

  const totalWidth = calculateTotalWidth();
  const gridHeight = 5 * dotSpacing; // ความสูงของตัวอักษร

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div
          className="relative rounded-lg p-4 mx-auto"
          style={{
            width: `${totalWidth + 20}px`,
            height: `${gridHeight + 20}px`,
            overflow: "hidden",
          }}
        >
          {/* คอนเทนเนอร์สำหรับตัวอักษร (จัดกลาง) */}
          <div className="flex justify-center">
            {letters.map((letter, letterIndex) => {
              const letterWidth = getLetterWidth(letter);

              return (
                <div
                  key={`letter-${letterIndex}`}
                  className="relative"
                  style={{
                    width: `${letterWidth}px`,
                    height: `${gridHeight}px`,
                    marginRight: "7px",
                    // marginRight: letterIndex < letters.length - 1 ? `${letterSpacing * dotSpacing}px` : '0'
                  }}
                >
                  {displayedDots
                    .filter((dot) => dot.letterIndex === letterIndex)
                    .map((dot) => (
                      <motion.div
                        key={`active-${letterIndex}-${dot.row}-${dot.col}`}
                        className="absolute bg-white rounded-full"
                        style={{
                          width: `${dotSize}px`,
                          height: `${dotSize}px`,
                          left: `${dot.col * dotSpacing}px`,
                          top: `${dot.row * dotSpacing}px`,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
