import { navItem, site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { Hud } from "./ui/Hud";
import styles from "./Lab.module.css";

export function Lab() {
  const { lab, ui } = site;
  const meta = navItem("lab");
  return (
    <section className={`sec ${styles.lab}`} id="lab" aria-labelledby="lab-title">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div>
            <Hud index={meta.index} name={meta.label} eyebrow={lab.eyebrow} />
            <h2 className="sec-title" id="lab-title">
              {lab.heading}
            </h2>
          </div>
          <p className="sec-intro">{lab.intro}</p>
        </div>

        <ul className={styles.exps}>
          {lab.items.map((item, i) => (
            <li key={item.title} className={styles.exp} data-reveal>
              <div className={styles.top}>
                <b>{`${ui.labPrefix}${pad2(i + 1)}`}</b>
                <span>{ui.labStatus}</span>
              </div>
              <LabGlyph variant={i} />
              <h3>{item.title}</h3>
              <p>{item.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LabGlyph({ variant }: { variant: number }) {
  const common = {
    className: styles.glyph,
    viewBox: "0 0 240 56",
    preserveAspectRatio: "xMinYMid meet",
    "aria-hidden": true,
    fill: "none",
  } as const;

  if (variant === 0) {
    return (
      <svg {...common}>
        <path d="M2 46 C40 46 50 12 92 14 S150 40 190 22 238 10 238 10" stroke="#8B5CF6" strokeWidth="1.5" />
        <g fill="#B39CFF">
          <circle cx="2" cy="46" r="3" />
          <circle cx="92" cy="14" r="3" />
          <circle cx="190" cy="22" r="3" />
        </g>
        <path d="M0 54h240" stroke="rgba(236,234,244,.15)" strokeDasharray="2 4" />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <svg {...common}>
        <rect x="2" y="8" width="90" height="10" rx="2" stroke="#B39CFF" />
        <rect x="2" y="8" width="90" height="10" rx="2" fill="#8B5CF6" fillOpacity=".35" />
        <rect x="2" y="32" width="90" height="10" rx="2" stroke="#B39CFF" />
        <rect x="2" y="32" width="48" height="10" rx="2" fill="#8B5CF6" fillOpacity=".35" />
        <path d="M60 37h28M80 31l8 6-8 6" stroke="#ECEAF4" strokeOpacity=".6" />
        <path d="M110 25h128" stroke="rgba(236,234,244,.15)" strokeDasharray="2 4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <g stroke="#B39CFF">
        <rect x="2" y="4" width="34" height="18" rx="3" />
        <rect x="2" y="34" width="34" height="18" rx="3" />
        <rect x="72" y="19" width="34" height="18" rx="3" />
        <rect x="142" y="19" width="34" height="18" rx="3" stroke="#8B5CF6" />
      </g>
      <path d="M36 13h18v15h18M36 43h18V28M106 28h36" stroke="#ECEAF4" strokeOpacity=".5" />
      <path d="M190 28h48" stroke="rgba(236,234,244,.15)" strokeDasharray="2 4" />
    </svg>
  );
}
