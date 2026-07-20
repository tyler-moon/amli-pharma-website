type LogoProps = {
  reversed?: boolean;
  stacked?: boolean;
};

export default function Logo({ reversed = false, stacked = false }: LogoProps) {
  const toneClass = reversed ? "logo--reversed" : "";

  if (stacked) {
    return (
      <div className={`logo logo--stacked ${toneClass}`}>
        <img className="logo__emblem" src="/images/amli-emblem.svg" alt="" aria-hidden="true" />
        <span className="logo__text">
          <span className="logo__amli">AMLI</span>
          <span className="logo__descriptor">PHARMA</span>
        </span>
      </div>
    );
  }

  return (
    <svg
      className={`logo logo--lockup ${toneClass}`}
      viewBox="0 0 470 112"
      width="470"
      height="112"
      role="img"
      aria-label="AMLI Pharma"
    >
      <image
        className="logo-lockup__emblem"
        href="/images/amli-emblem.svg"
        x="0"
        y="0"
        width="112"
        height="112"
        preserveAspectRatio="xMidYMid meet"
      />
      <line className="logo-lockup__rule" x1="162" y1="0" x2="162" y2="112" vectorEffect="non-scaling-stroke" />
      <text className="logo-lockup__amli" x="192" y="69">
        AMLI
      </text>
      <text className="logo-lockup__descriptor" x="194" y="100">
        PHARMA
      </text>
    </svg>
  );
}
