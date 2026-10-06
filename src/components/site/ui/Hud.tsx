import { pad2 } from "@/lib/format";

type HudProps = { index: number; name: string; eyebrow: string };

export function Hud({ index, name, eyebrow }: HudProps) {
  return (
    <p className="hud">
      <span className="hud__idx">{`[${pad2(index)}]`}</span>
      <span className="hud__name">{name}</span>
      <span className="hud__bar" aria-hidden="true" />
      <span className="hud__eyebrow">{eyebrow}</span>
    </p>
  );
}
