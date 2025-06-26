'use client';

import React, { useEffect, useRef } from 'react';

export default function TypewriterEffect() {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const texts = ['Passionate Web Developer.', 'Dedicated Competitive Programmer.']
 const currentIndexRef = useRef(0);
useEffect(() => {
  currentIndexRef.current++;
}, []);
  useEffect(() => {
    const typeText = (text: string, onComplete: () => void): void => {
      const chars: string[] = text.split('');
      if (textRef.current) {
        textRef.current.textContent = '';
      }

      chars.forEach((char: string, index: number) => {
        setTimeout(() => {
          if (textRef.current) {
            textRef.current.textContent += char;
          }
        }, index * 100);
      });

      setTimeout(onComplete, chars.length * 100 + 500);
    };

    const eraseText = (onComplete: () => void): void => {
      if (!textRef.current) return;
      
      const eraseInterval = setInterval(() => {
        if (textRef.current && textRef.current.textContent && textRef.current.textContent.length > 0) {
          textRef.current.textContent = textRef.current.textContent.slice(0, -1);
        } else {
          clearInterval(eraseInterval);
          setTimeout(onComplete, 500);
        }
      }, 50);
    };

    const animateSequence = () => {
      typeText(texts[currentIndexRef.current], () => {
        setTimeout(() => {
          eraseText(() => {
            currentIndexRef.current = (currentIndexRef.current + 1) % texts.length;
            setTimeout(animateSequence, 500);
          });
        }, 2000);
      });
    };

    if (subtitleRef.current) {
      subtitleRef.current.style.opacity = '0';
      subtitleRef.current.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (subtitleRef.current) {
          subtitleRef.current.style.transition = 'opacity 1s ease, transform 1s ease';
          subtitleRef.current.style.opacity = '1';
          subtitleRef.current.style.transform = 'translateY(0)';
        }
      }, 1000);
    }

    setTimeout(animateSequence, 500);

    const blinkCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = cursorRef.current.style.opacity === '0' ? '1' : '0';
      }
    };
    const cursorInterval = setInterval(blinkCursor, 500);

    return () => {
      clearInterval(cursorInterval);
    };

  }, []);

  return (
    <>
      <div className="text-2xl md:text-5xl font-extrabold bg-gradient-to-bl from-pink-400 via-purple-600 to-rose-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg">
        <span ref={textRef} className="inline-block min-h-[1.2em]"></span>
        <span 
          ref={cursorRef}
          className="inline-block w-1 h-[1.2em]  bg-emerald-500 ml-1 align-bottom"
        ></span>
      </div>
    </>
  );
}