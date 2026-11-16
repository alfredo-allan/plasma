/**
 * Barra de progresso em forma de shape de skate visto de cima: a lixa
 * (preta) vai sendo "pintada" de vermelho da tail até o nose conforme o
 * carregamento avança. Os 8 parafusos dos trucks ficam por cima.
 */
export function DeckProgress({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  // área útil do shape: x de 2 a 298 (viewBox 300x56)
  const fillWidth = (296 * pct) / 100;

  return (
    <svg viewBox="0 0 300 56" className="h-auto w-full" aria-hidden>
      <defs>
        <clipPath id="entry-deck-clip">
          <rect x="2" y="2" width="296" height="52" rx="26" />
        </clipPath>
        <linearGradient id="entry-deck-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#E54F3F" />
          <stop offset="1" stopColor="#DD3726" />
        </linearGradient>
      </defs>

      <g clipPath="url(#entry-deck-clip)">
        {/* lixa */}
        <rect x="0" y="0" width="300" height="56" fill="#141414" />
        {/* progresso */}
        <rect x="2" y="0" width={fillWidth} height="56" fill="url(#entry-deck-fill)" />
      </g>

      {/* parafusos dos trucks */}
      {[62, 80, 220, 238].flatMap((x) =>
        [20, 36].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#fffdf9" stroke="#000" strokeWidth="1.5" />
        )),
      )}

      {/* contorno */}
      <rect x="2" y="2" width="296" height="52" rx="26" fill="none" stroke="#000" strokeWidth="3" />
    </svg>
  );
}
