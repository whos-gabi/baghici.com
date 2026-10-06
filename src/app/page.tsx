import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Lab } from "@/components/site/Lab";
import { Nav } from "@/components/site/Nav";
import { Philosophy } from "@/components/site/Philosophy";
import { Services } from "@/components/site/Services";
import { RevealObserver } from "@/components/site/ui/Reveal";
import { Work } from "@/components/site/Work";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        {site.ui.skip}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Philosophy />
        <Services />
        <Work />
        <Lab />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
