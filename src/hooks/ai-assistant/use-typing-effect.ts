"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Custom hook that provides a smooth typing effect for streaming text.
 * Displays text character-by-character at a constant rate, creating a
 * ChatGPT-like smooth typing animation.
 */
export function useTypingEffect(
  targetText: string | null,
  speed: number = 20, // milliseconds per character
) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const displayedLengthRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    // If no target text, reset
    if (!targetText) {
      setDisplayedText("");
      setIsTyping(false);
      displayedLengthRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // If displayed text is already up to date, do nothing
    if (displayedText === targetText) {
      setIsTyping(false);
      return;
    }

    // Start typing animation
    setIsTyping(true);
    lastUpdateRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastUpdateRef.current;

      // Calculate how many characters to add based on elapsed time
      const charactersToAdd = Math.floor(elapsed / speed);

      if (charactersToAdd > 0) {
        lastUpdateRef.current = currentTime;

        const currentLength = displayedLengthRef.current;
        const targetLength = targetText.length;

        if (currentLength < targetLength) {
          // Add characters up to the calculated amount
          const newLength = Math.min(
            currentLength + charactersToAdd,
            targetLength,
          );
          displayedLengthRef.current = newLength;
          setDisplayedText(targetText.slice(0, newLength));
        }
      }

      // Continue animation if not complete
      if (displayedLengthRef.current < targetText.length) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsTyping(false);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetText, displayedText, speed]);

  return { displayedText, isTyping };
}
