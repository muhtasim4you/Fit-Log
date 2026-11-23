"use client";

import Image from "next/image";
import { useState } from "react";

export default function WorkoutImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={alt}>
        <span aria-hidden="true">FL</span>
      </div>
    );
  }

  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
