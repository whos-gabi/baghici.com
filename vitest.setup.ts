import { createElement } from "react";
import { vi } from "vitest";

type ImgProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
};

// next/image needs the Next runtime; in tests a plain <img> with the same src/alt is what we assert on.
vi.mock("next/image", () => ({
  default: ({ src, alt, width, height, className, sizes }: ImgProps) =>
    createElement("img", { src, alt, width, height, className, sizes }),
}));
