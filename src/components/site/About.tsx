import { navItem, site } from "@/content/site";
import { Duo } from "./ui/Duo";
import { Hud } from "./ui/Hud";
import styles from "./About.module.css";

export function About() {
  const { about, ui } = site;
  const meta = navItem("about");
  return (
    <section className="sec" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div>
            <Hud index={meta.index} name={meta.label} eyebrow={about.eyebrow} />
            <h2 className="sec-title" id="about-title">
              {about.heading}
            </h2>
          </div>
          <p className="sec-intro">{about.intro}</p>
        </div>

        <div className={styles.players}>
          {about.people.map((person) => (
            <article key={person.name} className={`${styles.player} reveal-color`} data-reveal>
              <div className={`${styles.frame} brackets`}>
                {/* teodora.jpg is 492px wide: the frame caps at 440px so it is never upscaled. */}
                <Duo person={person} alt={person.photo.alt} sizes="(min-width: 700px) 440px, 100vw" />
                <div className={styles.hud} aria-hidden="true">
                  <span>{person.slot}</span>
                  <span>{person.hudLabel}</span>
                </div>
              </div>
              <div className={styles.head}>
                <h3>{person.name}</h3>
                <p className={styles.role}>{person.role}</p>
              </div>
              <p className={styles.tag}>{person.tag}</p>
              <p className={styles.bio}>{person.bio}</p>
            </article>
          ))}

          <aside className={styles.together} data-reveal aria-label={ui.together.ariaLabel}>
            <p className={styles.togetherLabel}>
              <b>{ui.together.label}</b>
              <span aria-hidden="true">{ui.together.separator}</span>
              {ui.together.mode}
            </p>
            <p className={styles.togetherText}>{about.together}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
