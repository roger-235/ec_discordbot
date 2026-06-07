// PCB copper trace decorations

// DIP package IC chip — pins on left and right
// pinCount must be even
export function DIPChip({
  name = "NE555",
  pins = 8,
  className = "",
}: {
  name?: string
  pins?: number
  className?: string
}) {
  const halfPins = pins / 2
  const pinSpacing = 12
  const bodyH = halfPins * pinSpacing + 8
  const bodyW = 40
  const totalW = bodyW + 32 // 16px lead each side
  const totalH = bodyH + 4

  const leftPins = Array.from({ length: halfPins }, (_, i) => ({
    x1: 0, y1: 10 + i * pinSpacing,
    x2: 16, y2: 10 + i * pinSpacing,
    n: i + 1,
  }))
  const rightPins = Array.from({ length: halfPins }, (_, i) => ({
    x1: 16 + bodyW, y1: 10 + (halfPins - 1 - i) * pinSpacing,
    x2: 16 + bodyW + 16, y2: 10 + (halfPins - 1 - i) * pinSpacing,
    n: halfPins + i + 1,
  }))

  return (
    <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} className={className} fill="none">
      {/* body */}
      <rect x="16" y="2" width={bodyW} height={bodyH} stroke="currentColor" strokeWidth="1.5" />
      {/* notch */}
      <path d={`M ${16 + bodyW / 2 - 6},2 Q ${16 + bodyW / 2},8 ${16 + bodyW / 2 + 6},2`} stroke="currentColor" strokeWidth="1.2" />
      {/* label */}
      <text x={16 + bodyW / 2} y={bodyH / 2 + 8} textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="monospace">
        {name}
      </text>
      {/* pin 1 dot */}
      <circle cx="20" cy="10" r="2" fill="currentColor" opacity="0.5" />
      {/* left pins */}
      {leftPins.map((p) => (
        <g key={p.n}>
          <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke="currentColor" strokeWidth="1.2" />
          <circle cx={p.x1 + 2} cy={p.y1} r="2" stroke="currentColor" strokeWidth="0.8" />
        </g>
      ))}
      {/* right pins */}
      {rightPins.map((p) => (
        <g key={p.n}>
          <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke="currentColor" strokeWidth="1.2" />
          <circle cx={p.x2 - 2} cy={p.y1} r="2" stroke="currentColor" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  )
}

export function TraceH({ width = 200, className = "" }: { width?: number; className?: string }) {
  return (
    <svg width={width} height="20" viewBox={`0 0 ${width} 20`} className={className} fill="none">
      <circle cx="6" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="10" r="2" fill="currentColor" />
      <line x1="11" y1="10" x2={width - 11} y2="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={width - 6} cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={width - 6} cy="10" r="2" fill="currentColor" />
    </svg>
  )
}

export function TraceCorner({ className = "" }: { className?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className={className} fill="none">
      <circle cx="6" cy="34" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="34" r="2" fill="currentColor" />
      <line x1="6" y1="29" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6,14 Q6,6 14,6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="14" y1="6" x2="34" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="34" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="34" cy="6" r="2" fill="currentColor" />
    </svg>
  )
}

export function Via({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className={className} fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3" fill="currentColor" />
    </svg>
  )
}

export function TraceBus({ className = "" }: { className?: string }) {
  return (
    <svg width="120" height="50" viewBox="0 0 120 50" className={className} fill="none">
      {[8, 18, 28, 38].map((y, i) => (
        <g key={i}>
          <line x1="0" y1={y} x2="110" y2={y} stroke="currentColor" strokeWidth="1.2" />
          <circle cx="110" cy={y} r="3" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="110" cy={y} r="1.2" fill="currentColor" />
        </g>
      ))}
      <rect x="0" y="4" width="2" height="38" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function SchematicBox({ label = "U1", className = "" }: { label?: string; className?: string }) {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" className={className} fill="none">
      <rect x="20" y="10" width="40" height="40" stroke="currentColor" strokeWidth="1.5" />
      {[18, 30, 42].map((y, i) => (
        <g key={i}>
          <line x1="0" y1={y} x2="20" y2={y} stroke="currentColor" strokeWidth="1.2" />
          <line x1="60" y1={y} x2="80" y2={y} stroke="currentColor" strokeWidth="1.2" />
        </g>
      ))}
      <text x="40" y="33" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace">{label}</text>
    </svg>
  )
}

export function Oscilloscope({ className = "" }: { className?: string }) {
  return (
    <svg width="160" height="60" viewBox="0 0 160 60" className={className} fill="none">
      <rect x="1" y="1" width="158" height="58" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {[15, 30, 45].map((y) => (
        <line key={y} x1="8" y1={y} x2="152" y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      ))}
      {[30, 60, 90, 120].map((x) => (
        <line key={x} x1={x} y1="5" x2={x} y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      ))}
      <polyline
        points="8,30 20,30 20,12 35,12 35,48 50,48 50,12 65,12 65,48 80,48 80,12 95,12 95,48 110,48 110,12 125,12 125,30 152,30"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}
