// components/shared/SafeMotion.tsx
// Wrapper for Framer Motion components that respects prefers-reduced-motion
// and degrades gracefully to simple CSS transitions for better performance.

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

interface SafeMotionProps {
  children: React.ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initial?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animate?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exit?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transition?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whileHover?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whileTap?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whileInView?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewport?: any;
  style?: React.CSSProperties;
  onClick?: () => void;
  id?: string;
}

/**
 * SafeMotionDiv — replaces motion.div with reduced-motion awareness.
 * When reduced motion is preferred, skips animations entirely.
 */
export function SafeMotionDiv({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  variants,
  whileHover,
  whileTap,
  whileInView,
  viewport,
  style,
  onClick,
  id,
}: SafeMotionProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <motion.div
        className={className}
        style={style}
        whileHover={whileHover}
        whileTap={whileTap}
        onClick={onClick}
        id={id}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      variants={variants}
      whileHover={whileHover}
      whileTap={whileTap}
      whileInView={whileInView}
      viewport={viewport}
      style={style}
      onClick={onClick}
      id={id}
    >
      {children}
    </motion.div>
  );
}

/**
 * SafeAnimatePresence — wraps AnimatePresence with reduced-motion support.
 * When reduced motion is preferred, renders children without animation wrappers.
 */
export function SafeAnimatePresence({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode?: "sync" | "popLayout" | "wait";
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
}

/**
 * CSSFadeIn — Pure CSS replacement for simple fade-in animations.
 * Use this instead of motion.div for simple opacity transitions.
 */
export function CSSFadeIn({
  children,
  className = "",
  delay = 0,
  duration = 300,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <div
      className={`animate-in fade-in ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}

/**
 * CSSSlideIn — Pure CSS replacement for simple slide-in animations.
 */
export function CSSSlideIn({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 300,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}) {
  const directionClass = {
    up: "slide-in-from-bottom-4",
    down: "slide-in-from-top-4",
    left: "slide-in-from-right-4",
    right: "slide-in-from-left-4",
  }[direction];

  return (
    <div
      className={`animate-in fade-in ${directionClass} ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}
