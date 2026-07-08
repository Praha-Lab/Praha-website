"use client";

import { ArrowRight } from "lucide-react";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  })),
);

type DitherCardProps = {
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
  className?: string;
};

export function DitherCard({
  actionHref,
  actionLabel,
  children,
  className = "",
}: DitherCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReduceMotion(media.matches);

    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);

    return () => {
      media.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  return (
    <div
      className={`dither-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={<div className="dither-card-fallback" />}>
        <div className="dither-card-shader" aria-hidden="true">
          <Dithering
            colorBack="#00000000"
            colorFront="#ff4f1f"
            shape="warp"
            type="4x4"
            speed={reduceMotion ? 0 : isHovered ? 0.6 : 0.2}
            className="dither-card-canvas"
            width="100%"
            height="100%"
            minPixelRatio={1}
          />
        </div>
      </Suspense>

      {children ? <div className="dither-card-content">{children}</div> : null}

      {actionHref && actionLabel ? (
        <a className="dither-card-action" href={actionHref}>
          <span>{actionLabel}</span>
          <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
        </a>
      ) : null}
    </div>
  );
}
