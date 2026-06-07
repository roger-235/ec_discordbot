// SVG circuit component symbols for decorative use

export function Resistor({ className = "" }: { className?: string }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" className={className} fill="none">
      <line x1="0" y1="10" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="10,10 14,2 18,18 22,2 26,18 30,2 34,18 38,2 42,18 46,10 50,10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="50" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function Capacitor({ className = "" }: { className?: string }) {
  return (
    <svg width="40" height="30" viewBox="0 0 40 30" className={className} fill="none">
      <line x1="0" y1="15" x2="16" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="4" x2="16" y2="26" stroke="currentColor" strokeWidth="2.5" />
      <line x1="24" y1="4" x2="24" y2="26" stroke="currentColor" strokeWidth="2.5" />
      <line x1="24" y1="15" x2="40" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function IC({ pins = 4, className = "" }: { pins?: number; className?: string }) {
  const h = pins * 14 + 10
  const pinPositions = Array.from({ length: pins }, (_, i) => 12 + i * 14)
  return (
    <svg width="70" height={h} viewBox={`0 0 70 ${h}`} className={className} fill="none">
      <rect x="18" y="5" width="34" height={h - 10} stroke="currentColor" strokeWidth="1.5" />
      {pinPositions.map((y, i) => (
        <g key={i}>
          <line x1="0" y1={y} x2="18" y2={y} stroke="currentColor" strokeWidth="1.5" />
          <line x1="52" y1={y} x2="70" y2={y} stroke="currentColor" strokeWidth="1.5" />
        </g>
      ))}
      <text x="35" y={h / 2 + 4} textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace">IC</text>
    </svg>
  )
}

export function Ground({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className} fill="none">
      <line x1="12" y1="0" x2="12" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function LED({ className = "" }: { className?: string }) {
  return (
    <svg width="50" height="24" viewBox="0 0 50 24" className={className} fill="none">
      <line x1="0" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="14,4 14,20 28,12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="4" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="12" x2="50" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="32" y1="2" x2="36" y2="8" stroke="currentColor" strokeWidth="1" />
      <line x1="37" y1="0" x2="41" y2="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function Inductor({ className = "" }: { className?: string }) {
  return (
    <svg width="70" height="20" viewBox="0 0 70 20" className={className} fill="none">
      <line x1="0" y1="10" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10,10 Q15,0 20,10 Q25,0 30,10 Q35,0 40,10 Q45,0 50,10 Q55,0 60,10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="60" y1="10" x2="70" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
