import { site } from "@/content/site";
import { Brand } from "./ui/Brand";
import styles from "./Footer.module.css";

export function Footer() {
  const { footer, nav, brand, ui } = site;
  return (
    <footer className={styles.foot}>
      <div className="wrap">
        <div className={styles.top}>
          <div>
            <Brand />
            <p className={styles.tag}>{footer.tagline}</p>
          </div>
          <nav aria-label={ui.footerNav}>
            <ul className={styles.nav}>
              {nav.map((item) => (
                <li key={item.anchor}>
                  <a href={`#${item.anchor}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={styles.mark} aria-hidden="true">
          {brand.short}
        </p>
        <div className={styles.bottom}>
          <span>{footer.copyright}</span>
          <a href="#top">{ui.backToTop}</a>
        </div>
      </div>
    </footer>
  );
}
