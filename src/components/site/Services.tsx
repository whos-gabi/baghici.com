import { navItem, site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { Hud } from "./ui/Hud";
import styles from "./Services.module.css";

export function Services() {
  const { services, ui } = site;
  const meta = navItem("services");
  return (
    <section className="sec" id="services" aria-labelledby="svc-title">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div>
            <Hud index={meta.index} name={meta.label} eyebrow={services.eyebrow} />
            <h2 className="sec-title" id="svc-title">
              {services.heading}
            </h2>
          </div>
          <p className="sec-intro">{services.intro}</p>
        </div>

        <ol className={styles.svc}>
          {services.items.map((item, i) => (
            <li key={item.title} className={styles.row} data-reveal>
              <span className={styles.idx} aria-hidden="true">{`${ui.servicePrefix}${pad2(i + 1)}`}</span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.benefit}>{item.benefit}</p>
              <ul className={styles.details}>
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
