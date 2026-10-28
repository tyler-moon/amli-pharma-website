import { store, storeCopy } from "./store-data";

export default function StoreDetails({ locale = "en" }: { locale?: keyof typeof storeCopy }) {
  const copy = storeCopy[locale];
  return (
    <div className="store-details" lang={locale}>
      <dl className="store-details__facts">
        <div>
          <dt>{copy.addressLabel}</dt>
          <dd><address>{copy.address}</address></dd>
        </div>
        <div>
          <dt>{copy.hoursLabel}</dt>
          <dd>{copy.hours}</dd>
        </div>
        <div>
          <dt>{copy.contactLabel}</dt>
          <dd><a href={store.phoneHref}>{store.phone}</a></dd>
          <dd><a className="text-link" href={store.telegram} target="_blank" rel="noopener noreferrer">{copy.telegramLabel}</a></dd>
          {store.instagram && <dd><a className="text-link" href={store.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></dd>}
        </div>
      </dl>
      <nav className="store-details__maps" aria-label={copy.mapsLabel}>
        {store.maps.map((map) => (
          <a className="text-link" key={map.name} href={map.href} target="_blank" rel="noopener noreferrer">{map.name}</a>
        ))}
      </nav>
    </div>
  );
}
