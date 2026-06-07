import { DIPChip } from "@/components/CircuitTrace"

const chipTemplates = [
  { name: "NE555",   pins: 8,  rot:  25, scale: 1.4 },
  { name: "74HC04",  pins: 14, rot: -60, scale: 1.3 },
  { name: "LM311",   pins: 8,  rot:  45, scale: 1.5 },
  { name: "LM324",   pins: 14, rot: -30, scale: 1.2 },
  { name: "TL072",   pins: 8,  rot:  70, scale: 1.4 },
  { name: "LM741",   pins: 8,  rot: -45, scale: 1.6 },
  { name: "74HC595", pins: 16, rot:  60, scale: 1.2 },
  { name: "LM393",   pins: 8,  rot: -20, scale: 1.5 },
  { name: "NE555",   pins: 8,  rot:  40, scale: 1.3 },
  { name: "74HC04",  pins: 14, rot:  30, scale: 1.4 },
  { name: "LM358",   pins: 8,  rot: -70, scale: 1.5 },
  { name: "TL072",   pins: 8,  rot:  50, scale: 1.3 },
  { name: "LM311",   pins: 8,  rot: -40, scale: 1.6 },
  { name: "LM393",   pins: 8,  rot: -55, scale: 1.4 },
  { name: "74HC595", pins: 16, rot:  35, scale: 1.2 },
  { name: "LM741",   pins: 8,  rot: -25, scale: 1.5 },
  { name: "NE555",   pins: 8,  rot:  65, scale: 1.3 },
  { name: "LM324",   pins: 14, rot: -40, scale: 1.3 },
  { name: "74HC04",  pins: 14, rot:  55, scale: 1.4 },
  { name: "LM358",   pins: 8,  rot: -60, scale: 1.5 },
  { name: "LM311",   pins: 8,  rot:  30, scale: 1.2 },
  { name: "NE555",   pins: 8,  rot: -35, scale: 1.3 },
  { name: "LM358",   pins: 8,  rot:  80, scale: 1.4 },
  { name: "74HC04",  pins: 14, rot: -15, scale: 1.3 },
]

function chipBBox(left: number, top: number, pins: number, scale: number, rot: number) {
  const w = 72 * scale
  const h = (pins / 2 * 12 + 12) * scale
  const rad = (rot * Math.PI) / 180
  const c = Math.cos(rad), s = Math.sin(rad)
  const xs = [0, w * c, -h * s, w * c - h * s].map(x => left + x)
  const ys = [0, w * s,  h * c,  w * s + h * c].map(y => top  + y)
  return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) }
}

type BBox = ReturnType<typeof chipBBox>

function overlaps(a: BBox, b: BBox, gap: number) {
  return a.x1 < b.x2 + gap && a.x2 > b.x1 - gap &&
         a.y1 < b.y2 + gap && a.y2 > b.y1 - gap
}

function buildChipLayout() {
  const xs = [-20, 175, 370, 565, 760, 955, 1150, 1345]
  const ys = [ 30, 205, 380, 555, 730, 900]
  const candidates = ys.flatMap(y => xs.map(x => ({ x, y })))

  const bboxes: BBox[] = []
  return chipTemplates.flatMap((tmpl) => {
    for (const { x, y } of candidates) {
      const bbox = chipBBox(x, y, tmpl.pins, tmpl.scale, tmpl.rot)
      if (!bboxes.some(b => overlaps(bbox, b, 50))) {
        bboxes.push(bbox)
        return [{ ...tmpl, left: x, top: y }]
      }
    }
    return []
  })
}

const chips = buildChipLayout()

export default function ChipBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none text-[#d4a845] opacity-25 z-40 overflow-hidden">
      {chips.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: c.top,
            left: c.left,
            transform: `rotate(${c.rot}deg) scale(${c.scale})`,
            transformOrigin: "top left",
          }}
        >
          <DIPChip name={c.name} pins={c.pins} />
        </div>
      ))}
    </div>
  )
}
