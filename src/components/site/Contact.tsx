import { navItem, site } from "@/content/site";
import { mailtoHref, whatsappHref } from "@/lib/links";
import { Button } from "./ui/Button";
import { Hud } from "./ui/Hud";
import styles from "./Contact.module.css";

export function Contact() {
  const { contactSection, contact, ui } = site;
  const meta = navItem("contact");
  return (
    <section className="sec" id="contact" aria-labelledby="cta-title">
      <div className="wrap">
        <div className={styles.cta} data-reveal>
          <span className={styles.corner} aria-hidden="true">
            {ui.channelOpen}
          </span>
          <Hud index={meta.index} name={meta.label} eyebrow={contactSection.eyebrow} />
          <h2 className={styles.title} id="cta-title">
            {contactSection.heading.lead} <span>{contactSection.heading.accent}</span>
          </h2>
          <p className={styles.body}>{contactSection.body}</p>
          <div className={styles.row}>
            <Button href={whatsappHref(contact)} external srHint={ui.opensWhatsApp} className={styles.primary}>
              {contactSection.cta}
            </Button>
            <p className={styles.mail}>
              {contactSection.emailLead} <a href={mailtoHref(contact.email)}>{contact.email}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
