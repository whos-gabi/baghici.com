import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";
import { Ticker } from "./Ticker";
import { Button } from "./ui/Button";
import { Duo } from "./ui/Duo";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero, about, ui } = site;
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={`wrap ${styles.grid}`}>
        <div>
          <p className={styles.eyebrow}>
            <span className="rec" aria-hidden="true">
              {ui.live}
            </span>{" "}
            {hero.eyebrow}
          </p>
          <h1 className={styles.title} id="hero-title">
            {hero.h1.lead}{" "}
            <span className={styles.l2}>
              {hero.h1.accent} <em>{hero.h1.underline}</em>
            </span>
          </h1>
          <p className={styles.sub}>{hero.sub}</p>
          <div className={styles.ctas}>
            <Button href={whatsappHref(site.contact)} external srHint={ui.opensWhatsApp}>
              {hero.ctaPrimary}
            </Button>
            <Button href="#work" variant="ghost" icon="down">
              {hero.ctaSecondary}
            </Button>
          </div>
        </div>

        <aside className={`${styles.party} brackets`} aria-label={ui.party.ariaLabel}>
          <div className={styles.partyHead}>
            <span>{ui.party.title}</span>
            <b>{ui.party.count}</b>
          </div>
          <ul className={styles.partyList}>
            {about.people.map((person) => (
              <li key={person.name} className={`${styles.partyRow} reveal-color`}>
                <Duo person={person} alt={person.partyAlt} sizes="72px" />
                <div>
                  <span className={styles.slot}>{person.slot}</span>
                  <span className={styles.name}>{person.name}</span>
                  <span className={styles.role}>{person.role}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.partyFoot}>
            <span>
              {ui.party.footer}
              <span className="cursor" aria-hidden="true" />
            </span>
            <span>{ui.party.region}</span>
          </div>
        </aside>
      </div>

      <div className={`wrap ${styles.meta}`}>
        <a href="#about">
          <span className="scroll-line" aria-hidden="true" />
          {ui.scroll}
        </a>
        <span>{ui.start}</span>
      </div>

      <Ticker />
    </section>
  );
}
