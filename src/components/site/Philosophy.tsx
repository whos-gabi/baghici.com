import { Fragment } from "react";
import { navItem, site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { Hud } from "./ui/Hud";
import styles from "./Philosophy.module.css";

export function Philosophy() {
  const { philosophy, ui } = site;
  const meta = navItem("philosophy");
  return (
    <section className="sec" id="philosophy" aria-labelledby="philo-title">
      <div className="wrap">
        <div className={styles.philo}>
          <div data-reveal>
            <Hud index={meta.index} name={meta.label} eyebrow={philosophy.eyebrow} />
            <h2 className={styles.title} id="philo-title">
              {philosophy.heading.lead} <span>{philosophy.heading.accent}</span>
            </h2>
          </div>
          <p className={styles.body} data-reveal>
            {philosophy.body.map((segment, i) =>
              segment.strong ? <strong key={i}>{segment.text}</strong> : <Fragment key={i}>{segment.text}</Fragment>,
            )}
          </p>
        </div>

        <ul className={styles.spectrum} data-reveal>
          {philosophy.pillars.map((pillar, i) => (
            <li key={pillar.label} className={styles.pillar}>
              <div className={styles.top}>
                <span>{`${ui.pillarPrefix} ${pad2(i + 1)}`}</span>
                <Meter level={i + 1} />
              </div>
              <h3>{pillar.label}</h3>
              <p>{pillar.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Meter({ level }: { level: number }) {
  return (
    <span className={styles.meter} aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <i key={n} className={n <= level ? styles.on : undefined} />
      ))}
    </span>
  );
}
