import { site } from "@/content/site";
import styles from "./Brand.module.css";

export function Brand() {
  return (
    <a className={styles.brand} href="#top" aria-label={site.ui.brandAria}>
      <svg className={styles.mark} viewBox="0 0 34 34" aria-hidden="true">
        <rect x=".5" y=".5" width="33" height="33" rx="9" fill="#14121F" stroke="#8B5CF6" />
        <path
          d="M11 8.5h7.2a4.3 4.3 0 0 1 0 8.6H11zM11 17.1h8.4a4.2 4.2 0 0 1 0 8.4H11z"
          fill="none"
          stroke="#ECEAF4"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="23.5" y="7" width="3" height="3" fill="#C6F432" />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>{site.brand.short}</span>{" "}
        <span className={styles.sub}>{site.brand.sub}</span>
      </span>
    </a>
  );
}
