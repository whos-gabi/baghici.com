import Image from "next/image";
import { navItem, site, type Project } from "@/content/site";
import { pad2 } from "@/lib/format";
import { Hud } from "./ui/Hud";
import styles from "./Work.module.css";

export function Work() {
  const { work, ui } = site;
  const meta = navItem("work");
  return (
    <section className="sec" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div>
            <Hud index={meta.index} name={meta.label} eyebrow={work.eyebrow} />
            <h2 className="sec-title" id="work-title">
              {work.heading}
            </h2>
          </div>
          <p className="sec-intro">{work.intro}</p>
        </div>

        <article className={styles.feature} data-reveal aria-labelledby="mnir-title">
          <div>
            <p className={styles.flag}>
              <b>{ui.featured}</b>
              <span>{`${ui.workPrefix}${pad2(1)}`}</span>
            </p>
            <Image
              className={styles.logo}
              src={work.mnir.logo.src}
              alt={work.mnir.logo.alt}
              width={work.mnir.logo.width}
              height={work.mnir.logo.height}
              sizes="300px"
            />
            <h3 id="mnir-title">{work.mnir.title}</h3>
            <p className={styles.featureSub}>{work.mnir.subtitle}</p>
          </div>
          <div className={styles.items}>
            {work.mnir.items.map((item) => (
              <div key={item.title} className={styles.fitem}>
                <span className={styles.icon} aria-hidden="true">
                  {item.icon === "game" ? <GameIcon /> : <WarehouseIcon />}
                </span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.line}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <ul className={styles.tiles}>
          {work.projects.map((project, i) => (
            <ProjectTile key={project.name} project={project} number={i + 2} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectTile({ project, number }: { project: Project; number: number }) {
  const { ui } = site;
  const content = (
    <>
      <div className={styles.media}>
        <span className="mono" aria-hidden="true">{`${ui.workPrefix}${pad2(number)}`}</span>
        {project.href ? (
          <span className="mono" aria-hidden="true">
            {ui.visit}
          </span>
        ) : null}
        <ProjectMark project={project} />
      </div>
      <div className={styles.body}>
        <p className={styles.cat}>{project.category}</p>
        <h3>{project.name}</h3>
        <p className={styles.subtitle}>{project.subtitle}</p>
        {project.href ? <span className="vh">{ui.opensNewTab}</span> : null}
      </div>
    </>
  );

  return (
    <li className={styles.tile} data-reveal>
      {project.href ? (
        <a className={styles.link} href={project.href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}

function ProjectMark({ project }: { project: Project }) {
  const label = `${project.name} ${site.ui.monogramSuffix}`;
  if (project.logo) {
    return (
      <div className={styles.appicon}>
        <Image
          src={project.logo.src}
          alt={project.logo.alt}
          width={project.logo.width}
          height={project.logo.height}
          sizes="124px"
        />
      </div>
    );
  }
  if (project.monogram === "tank-arena") {
    return (
      <div className={`${styles.appicon} ${styles.ta}`} role="img" aria-label={label}>
        <svg viewBox="0 0 100 100" aria-hidden="true" fill="none">
          <circle cx="50" cy="50" r="34" stroke="#8B5CF6" strokeOpacity=".7" />
          <circle cx="50" cy="50" r="22" stroke="#8B5CF6" strokeOpacity=".35" strokeDasharray="3 4" />
          <path d="M50 6v14M50 80v14M6 50h14M80 50h14" stroke="#B39CFF" strokeWidth="1.4" />
          <path d="M14 26v-12h12M86 26v-12H74M14 74v12h12M86 74v12H74" stroke="#ECEAF4" strokeOpacity=".5" />
        </svg>
        <span aria-hidden="true">TA</span>
      </div>
    );
  }
  return (
    <div className={`${styles.appicon} ${styles.th}`} role="img" aria-label={label}>
      <svg viewBox="0 0 80 80" aria-hidden="true" fill="none">
        <circle cx="30" cy="34" r="17" stroke="#2A1466" strokeWidth="2" />
        <circle cx="50" cy="34" r="17" stroke="#7C3AED" strokeWidth="2" />
        <path d="M40 20.5a17 17 0 0 1 0 27a17 17 0 0 1 0-27z" fill="#7C3AED" fillOpacity=".25" />
        <text
          x="40"
          y="70"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="500"
          fontSize="8"
          fill="#2A1466"
          letterSpacing="1.2"
        >
          TWO·HANDS
        </text>
      </svg>
    </div>
  );
}

function GameIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="7" width="19" height="11" rx="5.5" />
      <path d="M7.5 10.5v4M5.5 12.5h4" />
      <circle cx="16" cy="11.5" r=".9" fill="currentColor" />
      <circle cx="18" cy="13.8" r=".9" fill="currentColor" />
    </svg>
  );
}

function WarehouseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5 12 4l9 5.5V20H3z" />
      <path d="M7 20v-6h10v6M7 17h10" />
    </svg>
  );
}
