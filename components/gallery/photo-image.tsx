"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type Photo = {
  image: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
};

/**
 * Next defaults to 75, which visibly smears rock and foliage detail once you
 * look closely. Photographs are the whole point here, so pay the bytes.
 */
const QUALITY = 90;

type PhotoImageProps = {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  className?: string;
  /**
   * `fade` crossfades the photo in over the blur layer. Cheap — `opacity` is
   * compositor-only, so it stays smooth with many images resolving at once.
   *
   * `resolve` animates the photo's own blur radius away instead. Nicer, but
   * `filter` is repainted every frame at the rendered size, so keep it to a
   * single hero image per page.
   */
  mode?: "fade" | "resolve";
  /**
   * Fill the parent box and crop, rather than keeping the photo's own aspect
   * ratio. The index grid uses this: a uniform tile height is what makes every
   * row line up, and that can't coexist with untouched aspect ratios.
   */
  crop?: boolean;
  /** Rendered inside the clipped frame — position it absolutely. */
  children?: React.ReactNode;
};

export function PhotoImage({
  photo,
  sizes,
  priority,
  className,
  mode = "fade",
  crop,
  children,
}: PhotoImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [settled, setSettled] = useState(false);

  const resolve = mode === "resolve";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        crop && "h-full w-full",
        className,
      )}
      // Older browsers (pre-Safari 15) don't infer aspect ratio from the width
      // and height attributes, so reserve the box explicitly. When cropping,
      // the grid track already defines the box.
      style={
        crop ? undefined : { aspectRatio: `${photo.width} / ${photo.height}` }
      }
    >
      <div
        aria-hidden
        className="absolute inset-0 scale-110 bg-cover bg-center blur-xl"
        style={{ backgroundImage: `url(${photo.blurDataURL})` }}
      />
      <Image
        src={photo.image}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        quality={QUALITY}
        priority={priority}
        // next/image invokes onLoad from a ref callback when `img.complete` is
        // already true, so this stays reliable for cached images — a raw <img>
        // would miss loads that finished before hydration.
        onLoad={() => setLoaded(true)}
        onTransitionEnd={() => setSettled(true)}
        className={cn(
          "relative w-full ease-out motion-reduce:transition-none",
          crop ? "h-full object-cover" : "h-auto",
          resolve
            ? [
                "transition-[filter,transform] duration-700",
                loaded ? "scale-100 blur-none" : "scale-105 blur-[20px]",
              ]
            : [
                "transition-opacity duration-[400ms]",
                loaded ? "opacity-100" : "opacity-0",
              ],
        )}
        style={
          resolve && !settled ? { willChange: "filter, transform" } : undefined
        }
      />
      {children}
    </div>
  );
}
