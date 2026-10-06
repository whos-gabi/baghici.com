import Image from "next/image";
import type { CSSProperties } from "react";
import type { Person } from "@/content/site";

type DuoProps = { person: Person; alt: string; sizes: string; className?: string };

export function Duo({ person, alt, sizes, className }: DuoProps) {
  const style = {
    "--pos": person.crop.position,
    "--origin": person.crop.position,
    "--zoom": String(person.crop.zoom),
  } as CSSProperties;
  return (
    <figure className={["duo", className].filter(Boolean).join(" ")} style={style}>
      <Image
        src={person.photo.src}
        alt={alt}
        width={person.photo.width}
        height={person.photo.height}
        sizes={sizes}
      />
    </figure>
  );
}
