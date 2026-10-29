"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Logo from "./Logo";
import OpeningGallery from "./OpeningGallery";
import StoreDetails from "./StoreDetails";
import { store } from "./store-data";

const FORM_ENDPOINT = "https://formsubmit.co/ajax/pharma.contact@amli.group";

const pillars = ["Beauty", "Pharmacy", "Telemedicine (in development)"];

const platformIcons: Record<string, React.ReactElement> = {
  Beauty: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 3h4M9.5 3v3.2c0 .6-.2 1.1-.5 1.6l-1.4 2A4 4 0 0 0 7 12.2V19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6.8a4 4 0 0 0-.6-2.4l-1.4-2c-.3-.5-.5-1-.5-1.6V3" />
      <path d="M7.2 14.5h9.6" />
    </svg>
  ),
  Pharmacy: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  Telemedicine: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
      <path d="m15.5 10 5-3v10l-5-3" />
    </svg>
  )
};

const platform = [
  {
    zone: "Beauty",
    title: "Beauty to discover, in person.",
    text: "Browse beauty and personal-care ranges, explore the shelves and try products in our Tashkent store.",
    img: "/images/triecare-beauty-experience.webp",
    srcSet: "/images/triecare-beauty-experience-800.webp 800w, /images/triecare-beauty-experience.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "Visitors exploring beauty products at the TRIECARE Tashkent opening."
  },
  {
    zone: "Pharmacy",
    title: "Care starts at the counter.",
    text: "Beauty and pharmacy come together in our Tashkent store. For pharmacy enquiries and product availability, speak directly with the store team.",
    img: "/images/triecare-store-service.webp",
    srcSet: "/images/triecare-store-service-800.webp 800w, /images/triecare-store-service.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "A TRIECARE team member speaking with visitors at the store counter."
  },
  {
    zone: "Telemedicine",
    title: "Care beyond the store.",
    text: "Our telemedicine service is in development. We are designing a physician-led pathway from an initial concern to a consultation and follow-up."
  }
];

const trust = [
  {
    label: "Physicians decide",
    text: "The service is being designed around licensed physicians. Any assistant will inform and guide, not diagnose or prescribe."
  },
  {
    label: "One membership, one record",
    text: "Our goal is to connect the store and digital care through one membership, with consent at each step."
  },
  {
    label: "Privacy by default",
    text: "Customer control over personal information and consent is a design requirement, not an optional extra."
  },
  {
    label: "Made for the region",
    text: "We are designing the digital care experience for local languages and the needs of customers in Uzbekistan."
  }
];

export default function Page() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleEnquiry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const get = (n: string) =>
      ((f.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | null)?.value || "").trim();
    if (get("_honey")) { setStatus("sent"); f.reset(); return; }
    const name = get("name");
    const payload = {
      name,
      organisation: get("organisation"),
      email: get("email"),
      message: get("message"),
      _subject: `AMLI Pharma enquiry: ${name || "Website"}`,
      _template: "table",
      _captcha: "false"
    };
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      f.reset();
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 40px 0px" }
    );
    items.forEach((item) => observer.observe(item));

    const header = document.querySelector(".site-header");
    const onScroll = () => {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Keep both video layers behind the family overlay.
    let raf = 0;
    let swapTimer = 0;
    let heroB: HTMLVideoElement | null = null;
    const heroA = document.querySelector(".hero__video") as HTMLVideoElement | null;
    if (heroA && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroB = heroA.cloneNode(true) as HTMLVideoElement;
      heroB.classList.add("hero__video--b");
      heroB.muted = true;
      heroB.loop = false;
      heroB.style.opacity = "0";
      heroA.loop = false;
      heroA.parentElement?.insertBefore(heroB, heroA.nextSibling);
      let front = heroA;
      let back = heroB;
      let swapping = false;
      const FADE = 0.9;
      void heroA.play().catch(() => undefined);
      const loop = () => {
        const d = front.duration;
        if (d && !swapping && front.currentTime >= d - FADE) {
          swapping = true;
          back.currentTime = 0;
          void back.play().catch(() => undefined);
          back.style.opacity = "1";
          front.style.opacity = "0";
          const tmp = front; front = back; back = tmp;
          swapTimer = window.setTimeout(() => { swapping = false; }, FADE * 1000);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(swapTimer);
      heroB?.remove();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="nav" aria-label="Primary navigation">
          <a href="#home" className="nav__brand" aria-label="AMLI Pharma home">
            <Logo reversed />
          </a>
          <div className="nav__links">
            <a href="#about">About</a>
            <a href="#triecare">TRIECARE</a>
            <a href="#platform">Platform</a>
            <a href="#app">Digital care</a>
          </div>
          <a className="nav__cta" href="#visit">
            Visit the store
          </a>
        </nav>
      </header>

      <main id="home">
        {/* Full-bleed video with the family wine overlay. */}
        <section className="hero">
          <video
            className="hero__video"
            muted
            loop
            playsInline
            poster="/images/triecare-storefront.webp"
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/videos/triecare-opening-hero.mp4" type="video/mp4" />
          </video>
          <div className="hero__overlay" />
          <div className="hero__content">
            <div className="hero__copy hero__copy--animate">
              <p className="eyebrow eyebrow--hero">AMLI Pharma</p>
              <h1>
                We connect
                <br /> beauty and care.
              </h1>
              <p className="hero__subtitle">
                Beauty and care, brought together through TRIECARE. Our first store
                opened in Tashkent, Uzbekistan, on 12 October 2026.
              </p>
              <div className="button-row">
                <a className="button button--secondary button--on-dark" href="#visit">
                  Find our Tashkent store
                </a>
              </div>
              <ul className="hero__pillars" aria-label="What we bring together">
                {pillars.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section section--intro" id="about" data-reveal>
          <div className="section__inner section__inner--split about-layout">
            <div className="section-heading section-heading--flush">
              <h2>Beauty and healthcare, under one roof.</h2>
              <p>
                AMLI Pharma is the health &amp; beauty company of AMLI Group.
                Through TRIECARE, we bring beauty and everyday care together in
                Tashkent, Uzbekistan. Our store opened on 12 October 2026.
              </p>
              <p>
                We are building a connected retail and care experience, starting
                with our physical store. Telemedicine remains in development.
              </p>
            </div>
            <figure className="about-photo">
              <img src="/images/triecare-storefront.webp" srcSet="/images/triecare-storefront-800.webp 800w, /images/triecare-storefront.webp 1600w" sizes="(max-width: 900px) 100vw, 600px" width="1600" height="680" alt="TRIECARE storefront with its sign and opening-day balloons in Tashkent." loading="lazy" />
            </figure>
          </div>
        </section>

        {/* TRIECARE brand and store information */}
        <section className="section section--brand" id="triecare" data-reveal>
          <div className="section__inner">
            <div className="section__inner--split">
              <div className="section-heading section-heading--flush">
                <h2>Meet TRIECARE.</h2>
                <p>
                  <strong>TRI is three:</strong> beauty, pharmacy and telemedicine.
                  A store you can visit today, with digital care being developed
                  for tomorrow.
                </p>
                <p>
                  Three petals meet at one point in our Bloom symbol.
                  At the centre is you.
                </p>
                <ul className="petal-legend" aria-label="What the three petals mean">
                  <li><span className="petal-dot petal-dot--plum" aria-hidden="true" />Pharmacy</li>
                  <li><span className="petal-dot petal-dot--coral" aria-hidden="true" />Beauty</li>
                  <li><span className="petal-dot petal-dot--rose" aria-hidden="true" />Telemedicine, in development</li>
                </ul>
                <a className="text-link" href="#opening">See the opening ceremony</a>
              </div>
              <div className="brand-panel brand-panel--store" data-reveal>
                <img
                  className="brand-panel__photo"
                  src="/images/triecare-tashkent-store.webp"
                  srcSet="/images/triecare-tashkent-store-800.webp 800w, /images/triecare-tashkent-store.webp 1600w"
                  sizes="(max-width: 1000px) 100vw, 650px"
                  width="1600"
                  height="1067"
                  alt="The TRIECARE Tashkent store, with beauty and personal-care shelves."
                  loading="lazy"
                />
                <p className="brand-panel__slogan">Uchta parvarish.<br />Bitta sen.</p>
                <p className="brand-panel__slogan-alt">
                  Three cares. One you.
                </p>
              </div>
            </div>
            <div className="store-visit" id="visit">
              <div className="store-visit__heading">
                <h3>Visit us in Tashkent.</h3>
                <p className="store-status">Open since <time dateTime="2026-10-12">12 October 2026</time></p>
                <nav className="store-languages" aria-label="Store information languages">
                  <a className="text-link" href="/store/uz/" hrefLang="uz" lang="uz">O&apos;zbekcha</a>
                  <a className="text-link" href="/store/ru/" hrefLang="ru" lang="ru">Русский</a>
                </nav>
              </div>
              <StoreDetails />
            </div>
          </div>
        </section>

        <OpeningGallery />

        {/* PLATFORM */}
        <section className="section" id="platform" data-reveal>
          <div className="section__inner">
            <div className="section-heading section-heading--wide">
              <h2>Inside our Tashkent store.</h2>
              <p className="store-status"><time dateTime="2026-10-12">Opened 12 October 2026</time> · Tashkent</p>
              <p>
                Beauty and everyday essentials in one place.
                Our telemedicine service is in development.
              </p>
            </div>
            <div className="feature-rows">
              {platform.map((p, i) => (
                <article className={`feature-row${i % 2 ? " feature-row--flip" : ""}${i === 0 ? " feature-row--lead" : ""}`} key={p.zone} data-reveal>
                  {p.zone === "Telemedicine" ? (
                    <figure className="care-concept feature-row__media" aria-label="Planned telemedicine pathway">
                      <figcaption>Telemedicine <span>In development</span></figcaption>
                      <ol>
                        <li>Share a concern</li>
                        <li>Speak with a physician</li>
                        <li>Plan follow-up</li>
                      </ol>
                      <p>Clinical decisions stay with licensed physicians.</p>
                    </figure>
                  ) : (
                    <figure className="media-frame feature-row__media">
                    <img
                      src={p.img}
                      srcSet={p.srcSet}
                      sizes={i === 0 ? "(max-width: 900px) 100vw, 800px" : "(max-width: 900px) 100vw, 650px"}
                      width={p.width}
                      height={p.height}
                      alt={p.alt}
                      loading="lazy"
                    />
                    </figure>
                  )}
                  <div className="feature-row__body">
                    {platformIcons[p.zone]}
                    <span className="zone-tag">{p.zone}</span>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Digital-care design principles. */}
        <section className="section section--dark" id="app" data-reveal>
          <div className="section__inner">
            <div>
              <div>
                <div className="section-heading section-heading--wide section-heading--on-dark">
                  <h2>Care stays in physicians&apos; hands.</h2>
                  <p>
                    Our telemedicine service is in development.
                    These principles guide the care experience we are building.
                  </p>
                </div>
                <ol className="practice-list practice-list--dark" aria-label="Operating principles">
                  {trust.map((t, i) => (
                    <li className="practice-row" key={t.label}>
                      <span className="practice-row__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <div className="practice-row__body">
                        <h3>{t.label}</h3>
                        <p>{t.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact" data-reveal>
          <div className="section__inner section__inner--contact">
            <div className="contact-details">
              <h2>Partner or connect with us.</h2>
              <p>
                For partnership, supply or general enquiries about AMLI Pharma, get in touch.
              </p>
              <p>For store enquiries in Tashkent, call <a className="text-link" href={store.phoneHref}>{store.phone}</a> or <a className="text-link" href={store.telegram}>message us on Telegram</a>.</p>
            </div>
            <div className="callout callout--gold">
              <h2>Write to us.</h2>
              {status === "sent" ? (
                <div className="contact-form__success" role="status">
                  <p className="contact-form__success-title">Thank you. Your message is on its way.</p>
                  <p>Our team will be in touch shortly.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleEnquiry}>
                  <div className="contact-form__row">
                    <input className="contact-form__input" type="text" name="name" placeholder="Name" aria-label="Name" autoComplete="name" required />
                    <input className="contact-form__input" type="text" name="organisation" placeholder="Organisation" aria-label="Organisation" autoComplete="organization" />
                  </div>
                  <input className="contact-form__input" type="email" name="email" placeholder="Email" aria-label="Email" autoComplete="email" required />
                  <textarea className="contact-form__input contact-form__textarea" name="message" placeholder="How can we help?" aria-label="How can we help?" rows={4} required />
                  <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="contact-form__honey" />
                  <button className="button button--primary" type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send enquiry"}
                  </button>
                  {status === "error" ? (
                    <p className="contact-form__note contact-form__note--error">
                      Something went wrong. Please email{" "}
                      <a className="text-link" href="mailto:pharma.contact@amli.group">pharma.contact@amli.group</a>.
                    </p>
                  ) : (
                    <p className="contact-form__note">Sent straight to our corporate team.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div>
            <Logo reversed />
            <p>Anchored &middot; Merit &middot; Legacy &middot; Intent</p>
          </div>
          <div className="footer__columns">
            <div>
              <h3>AMLI Companies</h3>
              <a href="https://amli.group">AMLI Group</a>
              <a href="https://mountains.amli.group">AMLI Mountains</a>
              <a href="https://property.amli.group">AMLI Property</a>
              <a href="https://kredit.amli.group">AMLI Kredit</a>
              <a href="https://capital.amli.group">AMLI Asia Capital</a>
              <a href="https://greens.amli.group">AMLI Greens</a>
            </div>
            <div>
              <h3>Company</h3>
              <a href="#about">About</a>
              <a href="#triecare">TRIECARE</a>
              <a href="#platform">Platform</a>
              <a href="#app">Digital care</a>
            </div>
            <div>
              <h3>Tashkent store</h3>
              <a href="#visit">Bunyodkor 7G, Chilonzor</a>
              <a href={store.phoneHref}>{store.phone}</a>
              <a href={store.telegram}>Telegram @triecare_uz</a>
              <a href={store.instagram}>Instagram @triecare.uz</a>
              <h3 className="footer__corporate-label">Corporate enquiries</h3>
              <a href="mailto:pharma.contact@amli.group">pharma.contact@amli.group</a>
              <a href="tel:+60362636464">+60 3-6263 6464</a>
            </div>
          </div>
        </div>
        <div className="footer__legal">
          <p>&copy; 2026 AMLI Pharma. An AMLI Group company.</p>
          <div className="footer__entity">
            <p>{store.entity} · STIR {store.stir} · Registration {store.registration}</p>
            {store.licence && <p>Pharmacy licence No. {store.licence}</p>}
          </div>
        </div>
      </footer>
    </>
  );
}
