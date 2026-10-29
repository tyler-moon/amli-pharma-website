"use client";

import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const photos = [
  { image: "ribbon-cutting", alt: "Three guests cutting the red ribbon at the TRIECARE entrance, with musicians and attendees behind them." },
  { image: "ribbon-celebration", alt: "The ribbon-cutting guests holding the cut ribbon as attendees applaud outside TRIECARE." },
  { image: "stage-guests", alt: "Guests together on stage in front of the TRIECARE Grand Opening Ceremony backdrop." },
  { image: "live-music", alt: "Musicians performing in traditional dress on the outdoor opening-ceremony stage." },
  { image: "event-audience", alt: "Attendees seated outside for the TRIECARE opening ceremony in Tashkent." },
  { image: "store-visit", alt: "Opening-day visitors exploring the shelves inside the TRIECARE store." }
];

export default function OpeningGallery() {
  const frame = useRef<HTMLDivElement>(null);
  const rotationPointer = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [slide, setSlide] = useState({ active: 0, previous: 0 });
  const [loaded, setLoaded] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const playing = !paused && !hovered && !reducedMotion && inView && pageVisible && loaded.length > 1;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    setLoaded(Array.from(frame.current?.querySelectorAll("img") ?? []).flatMap(
      (image, index) => image.complete && image.naturalWidth > 0 ? [index] : []
    ));
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    if (frame.current) observer.observe(frame.current);
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSlide((current) => ({
        active: loaded.find((index) => index > current.active) ?? loaded[0],
        previous: current.active
      }));
    }, 7000);
    return () => window.clearInterval(timer);
  }, [playing, loaded]);

  useEffect(() => {
    const current = frame.current?.querySelectorAll("img")[slide.active];
    if (current?.complete && current.naturalWidth === 0 && loaded.length) {
      setSlide({ active: loaded[0], previous: loaded[0] });
    }
  }, [slide.active, loaded]);

  function move(direction: number) {
    if (loaded.length < 2) return;
    setPaused(true);
    setSlide((current) => ({
      active: loaded[(loaded.indexOf(current.active) + direction + loaded.length) % loaded.length],
      previous: current.active
    }));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  return (
    <section className="section opening-gallery" id="opening" aria-labelledby="opening-title">
      <div className="section__inner">
        <div className="opening-gallery__heading">
          <h2 id="opening-title">TRIECARE opening day.</h2>
          <p><time dateTime="2026-10-12">12 October 2026</time><br />Tashkent, Uzbekistan</p>
        </div>
        <div
          className="opening-gallery__carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="TRIECARE opening photographs"
          data-active={slide.active}
          data-playing={playing}
          data-reduced-motion={reducedMotion}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => { if (!rotationPointer.current) setPaused(true); }}
        >
          <div
            className="opening-gallery__frame"
            ref={frame}
            onTouchStart={(event) => {
              const touch = event.touches[0];
              touchStart.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start) return;
              const touch = event.changedTouches[0];
              const dx = touch.clientX - start.x;
              const dy = touch.clientY - start.y;
              if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
            }}
            onTouchCancel={() => { touchStart.current = null; }}
          >
            {photos.map((photo, index) => (
              <img
                key={photo.image}
                className={`opening-gallery__image${slide.previous === index ? " is-previous" : ""}${slide.active === index ? " is-active" : ""}`}
                src={`/images/opening/${photo.image}.webp`}
                srcSet={`/images/opening/${photo.image}-800.webp 800w, /images/opening/${photo.image}.webp 1600w`}
                sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1236px) calc(100vw - 56px), 1180px"
                width="1600"
                height="1067"
                alt={photo.alt}
                aria-hidden={slide.active !== index}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded((current) => current.includes(index) ? current : [...current, index].sort((a, b) => a - b))}
                onError={() => setLoaded((current) => current.filter((value) => value !== index))}
              />
            ))}
          </div>
          <div className="opening-gallery__footer">
            <span className="opening-gallery__count" aria-hidden="true">{String(slide.active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
            <span className="opening-gallery__status" aria-live={paused || reducedMotion ? "polite" : "off"} aria-atomic="true">
              Photograph {slide.active + 1} of {photos.length}. {photos[slide.active].alt}
            </span>
            <div className="opening-gallery__controls">
              {!reducedMotion && (
                <button
                  className="opening-gallery__rotation"
                  type="button"
                  aria-label={paused ? "Play photo rotation" : "Pause photo rotation"}
                  title={paused ? "Play photo rotation" : "Pause photo rotation"}
                  // Keyboard focus pauses; pointer focus must preserve the clicked action.
                  onPointerDown={() => { rotationPointer.current = true; }}
                  onPointerUp={() => { rotationPointer.current = false; }}
                  onPointerCancel={() => { rotationPointer.current = false; }}
                  onClick={() => setPaused((current) => !current)}
                  disabled={loaded.length < 2}
                >
                  {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
                </button>
              )}
              <button type="button" aria-label="Previous opening photograph" title="Previous photograph" onClick={() => move(-1)} disabled={loaded.length < 2}><ArrowLeft size={20} aria-hidden="true" /></button>
              <button type="button" aria-label="Next opening photograph" title="Next photograph" onClick={() => move(1)} disabled={loaded.length < 2}><ArrowRight size={20} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
