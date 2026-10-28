import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Logo from "../../Logo";
import StoreDetails from "../../StoreDetails";
import { store, storeCopy } from "../../store-data";

const locales = ["uz", "ru"] as const;
type Locale = typeof locales[number];
type Props = { params: Promise<{ locale: string }> };

const copy = {
  uz: {
    description: "TRIECARE. Kosmetika va dorixona bir joyda. Toshkent, Bunyodkor 7G. Har kuni 08:00-23:00.",
    intro: "Kosmetika va kundalik parvarish mahsulotlari. Siz uchun bir joyda.",
    contact: "Bog'lanish",
    store: "Do'kon",
    back: "AMLI Pharma haqida",
    opening: "2026-yil 12-oktabrdan ochiq.",
    development: "Telemeditsina xizmati ishlab chiqilmoqda.",
    registration: "Ro'yxat raqami",
    licence: "Dorixona litsenziyasi raqami"
  },
  ru: {
    description: "TRIECARE. Косметика и аптека в одном месте. Ташкент, Бунёдкор 7Г. Ежедневно 08:00-23:00.",
    intro: "Косметика и товары для ежедневного ухода. Всё в одном месте.",
    contact: "Связаться",
    store: "Магазин",
    back: "Об AMLI Pharma",
    opening: "Открыто с 12 октября 2026 года.",
    development: "Сервис телемедицины находится в разработке.",
    registration: "Регистрационный номер",
    licence: "Номер аптечной лицензии"
  }
};

function getLocale(value: string): Locale {
  if (value !== "uz" && value !== "ru") notFound();
  return value;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  return {
    title: `TRIECARE | ${locale === "uz" ? "Toshkent" : "Ташкент"}, Bunyodkor 7G`,
    description: copy[locale].description,
    alternates: {
      canonical: `/store/${locale}/`,
      languages: { uz: "/store/uz/", ru: "/store/ru/", "x-default": "/#visit" }
    },
    openGraph: {
      title: "TRIECARE | Tashkent",
      description: copy[locale].description,
      images: ["/images/triecare-storefront.webp"],
      locale: locale === "uz" ? "uz_UZ" : "ru_UZ"
    }
  };
}

export default async function StorePage({ params }: Props) {
  const locale = getLocale((await params).locale);
  const text = copy[locale];
  return (
    <div className="store-page" lang={locale}>
      <header className="site-header">
        <nav className="nav" aria-label={text.store}>
          <a href="/" className="nav__brand" aria-label="AMLI Pharma"><Logo reversed /></a>
          <div className="store-languages store-languages--header" aria-label="Language">
            <a href="/store/uz/" hrefLang="uz" lang="uz" aria-current={locale === "uz" ? "page" : undefined}>O&apos;zbekcha</a>
            <a href="/store/ru/" hrefLang="ru" lang="ru" aria-current={locale === "ru" ? "page" : undefined}>Русский</a>
          </div>
        </nav>
      </header>
      <main>
        <section className="store-page__hero">
          <img src="/images/triecare-storefront.webp" srcSet="/images/triecare-storefront-800.webp 800w, /images/triecare-storefront.webp 1600w" sizes="100vw" width="1600" height="680" alt={locale === "uz" ? "Toshkentdagi TRIECARE do'koni" : "Магазин TRIECARE в Ташкенте"} fetchPriority="high" />
          <div className="store-page__hero-copy section__inner">
            <h1>TRIECARE</h1>
            <p>{text.intro}</p>
          </div>
        </section>
        <section className="section store-page__visit">
          <div className="section__inner">
            <div className="section-heading">
              <h2>{storeCopy[locale].title}</h2>
              <p>{text.opening}</p>
            </div>
            <StoreDetails locale={locale} />
            <p className="store-page__development">{text.development}</p>
          </div>
        </section>
      </main>
      <footer className="footer store-page__footer">
        <div className="section__inner">
          <p>{store.entity}</p>
          <p>STIR {store.stir} · {text.registration}: {store.registration}</p>
          <p>{text.licence}: {store.licence}</p>
          <a className="text-link" href="/">{text.back}</a>
        </div>
      </footer>
    </div>
  );
}
