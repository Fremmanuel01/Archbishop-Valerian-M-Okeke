// Custom ecclesiastical icon set — hand-drawn look, stroke-based, currentColor.
// Consistent: 24×24 viewBox, stroke-width 1.5, round caps & joins.

type IconProps = {
  className?: string;
  size?: number;
  strokeWidth?: number;
  title?: string;
};

function base(props: IconProps) {
  const { className = "", size = 24, strokeWidth = 1.5, title } = props;
  return {
    className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    role: title ? "img" : ("presentation" as const),
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
  };
}

export function ChiRho(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Chi (X) */}
      <path d="M6 6 L18 18" />
      <path d="M18 6 L10.5 13.5" />
      {/* Rho (P) — vertical stem + loop */}
      <path d="M12 2 L12 22" />
      <path d="M12 2 Q 17 2 17 7 Q 17 12 12 12" />
    </svg>
  );
}

export function Crozier(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Curved shepherd hook + straight staff */}
      <path d="M8 4 Q 14 4 14 9 Q 14 12 11 11.2 Q 8.4 10.5 9 8" />
      <path d="M12 10 L12 22" />
    </svg>
  );
}

export function Mitre(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Base */}
      <path d="M6 20 L18 20" />
      {/* Hat body: inward curved tall pointed cap */}
      <path d="M7 20 L7 13 Q 7 5 12 2 Q 17 5 17 13 L17 20 Z" />
      {/* Centre band */}
      <path d="M7 16 L17 16" />
      {/* Central ridge */}
      <path d="M12 2 L12 10" />
    </svg>
  );
}

export function Dove(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Body + wing + head + beak — stylised descending dove */}
      <path d="M4 13 Q 6 8 11 9 L 16 6 L 15 10 L 19 11 L 15 13 Q 11 16 5 15 Z" />
      <circle cx="17.5" cy="9" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Chalice(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Host (circle) */}
      <circle cx="12" cy="3.5" r="1.8" />
      {/* Cup rim + bowl */}
      <path d="M7 8 L17 8" />
      <path d="M7 8 Q 8 14 12 14 Q 16 14 17 8" />
      {/* Stem + node */}
      <path d="M12 14 L12 19" />
      <circle cx="12" cy="16.5" r="0.8" />
      {/* Base */}
      <path d="M8 21 L16 21" />
      <path d="M10 19 L14 19" />
    </svg>
  );
}

export function Candle(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Flame */}
      <path d="M12 2 Q 10 5 11 7 Q 12 8.5 13 7 Q 14 5 12 2 Z" />
      {/* Wick */}
      <path d="M12 7 L12 9" />
      {/* Candle body */}
      <path d="M9.5 9 L9.5 19 L14.5 19 L14.5 9" />
      {/* Drip line */}
      <path d="M9.5 11 L11 12" />
      {/* Base */}
      <path d="M8 22 L16 22" />
      <path d="M9.5 19 L9.5 21 L14.5 21 L14.5 19" />
    </svg>
  );
}

export function Keys(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Key 1 — upper-left to lower-right */}
      <circle cx="6" cy="6" r="2.5" />
      <path d="M7.8 7.8 L18 18" />
      <path d="M15 15 L17 13" />
      <path d="M17 17 L19 15" />
      {/* Key 2 — upper-right to lower-left */}
      <circle cx="18" cy="6" r="2.5" />
      <path d="M16.2 7.8 L6 18" />
      <path d="M9 15 L7 13" />
      <path d="M7 17 L5 15" />
    </svg>
  );
}

export function Lamb(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Halo with cross */}
      <circle cx="7" cy="7" r="3" />
      <path d="M7 4.5 L7 6" />
      <path d="M5.5 7 L8.5 7" />
      {/* Body */}
      <ellipse cx="13" cy="13" rx="6" ry="3.5" />
      {/* Legs */}
      <path d="M9 16 L9 20" />
      <path d="M12 16 L12 20" />
      <path d="M15 16 L15 20" />
      <path d="M18 16 L18 20" />
    </svg>
  );
}

export function Fleuron(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* Editorial section divider — stylised fleuron */}
      <path d="M4 12 L10 12" />
      <path d="M14 12 L20 12" />
      <path d="M12 8 Q 10 10 10 12 Q 10 14 12 16 Q 14 14 14 12 Q 14 10 12 8 Z" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
