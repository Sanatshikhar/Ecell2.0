import * as React from "react";
import { motion, Variants } from "framer-motion";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  duration?: number;
  delay?: number;
  replay?: boolean;
  className?: string;
  textClassName?: string;
  underlineClassName?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  underlineGradient?: string;
  underlineHeight?: string;
  underlineOffset?: string;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      duration = 0.05,
      delay = 0.1,
      replay = true,
      className,
      textClassName,
      underlineClassName,
      as: Component = "h1",
      underlineGradient = "from-blue-500 via-purple-500 to-pink-500",
      underlineHeight = "h-[0px]",
      underlineOffset = "-bottom-1",
      ...props
    },
    ref
  ) => {
    const letters = Array.from(text);

    const container: Variants = {
      hidden: {
        opacity: 0,
      },
      visible: (i: number = 1) => ({
        opacity: 1,
        transition: {
          staggerChildren: duration,
          delayChildren: i * delay,
        },
      }),
    };

    const child: Variants = {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 200,
        },
      },
      hidden: {
        opacity: 0,
        y: 20,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 200,
        },
      },
    };

    const lineVariants: Variants = {
      hidden: {
        width: "0%",
        left: "50%",
      },
      visible: {
        width: "100%",
        left: "0%",
        transition: {
          delay: letters.length * delay,
          duration: 0.8,
          ease: "easeOut",
        },
      },
    };

    return (
      <div
        ref={ref}
        className={`flex w-full flex-col items-center justify-center px-4 ${className}`}  // Added px-4 for mobile padding
        {...props}
      >
        <div className="relative w-auto max-w-4xl">
          <motion.div
            variants={container}
            initial="hidden"
            animate={replay ? "visible" : "hidden"}
            className={`flex flex-wrap justify-center text-center text-lg font-bold leading-tight sm:text-3xl md:text-4xl ${textClassName}`}  // Changed to flex-wrap
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={child}
                className="inline-block"  // Important for proper wrapping
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className={`absolute ${underlineHeight} ${underlineOffset} w-full bg-gradient-to-r ${underlineGradient} ${underlineClassName}`}
          />
        </div>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
