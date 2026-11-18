/*
 * Illustration library
 * --------------------
 * Small, flat SVG drawings in the Catalyst style (ink outlines, red accents).
 * Every illustration takes the same props:
 *   size   – width/height in px (default 96)
 *   title  – accessible label; leave it out when the picture is decorative
 *   className
 * Usage: import { Laptop, Cpu } from '../../design-system/illustrations'
 *        <Laptop size={120} title="Laptop" />
 * Add new drawings at the bottom; <Illo name="..." /> (Illo.jsx) finds them by name.
 */

const INK = '#1A1A1A'
const RED = '#E00C16'
const ROSE = '#FCE6E7'
const WHITE = '#FFFFFF'
const GREY = '#C9C9D1'
const AMBER = '#F5B841'
const GREEN = '#2E9D6B'
const BLUE = '#9CC4FF'

function Svg({ size = 96, title, className = '', children, viewBox = '0 0 120 120' }) {
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      className={`illo ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="none"
      stroke={INK}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

/* ---------- Devices ---------- */

export const Laptop = (p) => (
  <Svg {...p}>
    <rect x="22" y="24" width="76" height="52" rx="6" fill={WHITE} />
    <rect x="29" y="31" width="62" height="38" rx="3" fill={ROSE} stroke="none" />
    <path d="M38 44h22M38 52h34M38 60h16" stroke={RED} />
    <path d="M10 82h100l-6 12H16z" fill={INK} />
  </Svg>
)

export const Desktop = (p) => (
  <Svg {...p}>
    <rect x="10" y="18" width="78" height="56" rx="6" fill={WHITE} />
    <rect x="17" y="25" width="64" height="42" rx="3" fill={ROSE} stroke="none" />
    <path d="M44 74v12M30 92h28" />
    <rect x="94" y="30" width="18" height="62" rx="4" fill={INK} />
    <circle cx="103" cy="42" r="3" fill={RED} stroke="none" />
    <path d="M99 54h8M99 60h8" stroke={GREY} />
  </Svg>
)

export const Phone = (p) => (
  <Svg {...p}>
    <rect x="36" y="8" width="48" height="104" rx="10" fill={INK} />
    <rect x="41" y="18" width="38" height="80" rx="4" fill={ROSE} stroke="none" />
    <rect x="47" y="28" width="26" height="18" rx="3" fill={RED} stroke="none" />
    <path d="M47 56h26M47 64h18M47 72h22" stroke={WHITE} strokeWidth="3" />
    <circle cx="60" cy="104" r="3" fill={WHITE} stroke="none" />
  </Svg>
)

export const Tablet = (p) => (
  <Svg {...p}>
    <rect x="18" y="12" width="84" height="96" rx="10" fill={INK} />
    <rect x="25" y="20" width="70" height="80" rx="4" fill={ROSE} stroke="none" />
    <rect x="33" y="30" width="54" height="26" rx="3" fill={RED} stroke="none" />
    <path d="M33 66h40M33 76h28" stroke={WHITE} />
  </Svg>
)

export const Server = (p) => (
  <Svg {...p}>
    <rect x="28" y="8" width="64" height="104" rx="8" fill={INK} />
    {[20, 44, 68].map((y) => (
      <g key={y}>
        <rect x="36" y={y} width="48" height="18" rx="3" fill="#2A2A2F" stroke="none" />
        <circle cx="44" cy={y + 9} r="3" fill={GREEN} stroke="none" />
        <path d={`M54 ${y + 9}h22`} stroke="#4A4A52" />
      </g>
    ))}
    <circle cx="60" cy="98" r="4" fill={RED} stroke="none" />
  </Svg>
)

export const DataCenter = (p) => (
  <Svg {...p}>
    <path d="M10 104h100" />
    {[14, 46, 78].map((x) => (
      <g key={x}>
        <rect x={x} y="34" width="28" height="70" rx="4" fill={INK} />
        {[44, 60, 76].map((y) => (
          <g key={y}>
            <rect x={x + 5} y={y} width="18" height="10" rx="2" fill="#2A2A2F" stroke="none" />
            <circle cx={x + 9} cy={y + 5} r="2" fill={GREEN} stroke="none" />
          </g>
        ))}
      </g>
    ))}
    <path d="M30 22c0-7 6-12 13-12 5 0 9 3 11 7 2-1 4-2 6-2 6 0 10 4 10 10H30z" fill={ROSE} stroke={RED} />
  </Svg>
)

export const Smartwatch = (p) => (
  <Svg {...p}>
    <rect x="44" y="6" width="32" height="26" rx="6" fill={INK} />
    <rect x="44" y="88" width="32" height="26" rx="6" fill={INK} />
    <rect x="34" y="28" width="52" height="64" rx="14" fill={WHITE} />
    <rect x="41" y="35" width="38" height="50" rx="9" fill={ROSE} stroke="none" />
    <path d="M44 62h8l4-10 6 18 4-8h10" stroke={RED} />
    <path d="M88 52v14" />
  </Svg>
)

export const Car = (p) => (
  <Svg {...p}>
    <path d="M10 78V64l12-6 12-20h46l16 20 14 6v14z" fill={RED} />
    <path d="M38 42h18v16H28zM62 42h14l12 16H62z" fill={BLUE} />
    <circle cx="32" cy="80" r="11" fill={INK} />
    <circle cx="90" cy="80" r="11" fill={INK} />
    <circle cx="32" cy="80" r="4" fill={GREY} stroke="none" />
    <circle cx="90" cy="80" r="4" fill={GREY} stroke="none" />
    <path d="M104 66h6" stroke={AMBER} />
  </Svg>
)

export const WashingMachine = (p) => (
  <Svg {...p}>
    <rect x="22" y="10" width="76" height="100" rx="8" fill={WHITE} />
    <path d="M22 32h76" />
    <circle cx="36" cy="21" r="4" fill={RED} stroke="none" />
    <rect x="50" y="17" width="34" height="8" rx="4" fill={ROSE} stroke="none" />
    <circle cx="60" cy="70" r="26" fill={ROSE} />
    <path d="M38 74c6-6 12 6 22 0s14 6 22 0" stroke={RED} />
    <circle cx="60" cy="70" r="18" stroke={GREY} strokeWidth="2" />
  </Svg>
)

export const TrafficLight = (p) => (
  <Svg {...p}>
    <rect x="40" y="6" width="40" height="96" rx="10" fill={INK} />
    <circle cx="60" cy="26" r="10" fill={RED} stroke="none" />
    <circle cx="60" cy="54" r="10" fill={AMBER} stroke="none" opacity="0.45" />
    <circle cx="60" cy="82" r="10" fill={GREEN} stroke="none" opacity="0.45" />
    <path d="M60 102v14" />
  </Svg>
)

export const Atm = (p) => (
  <Svg {...p}>
    <rect x="20" y="10" width="80" height="100" rx="8" fill={WHITE} />
    <rect x="30" y="20" width="60" height="34" rx="4" fill={ROSE} />
    <path d="M38 32h28M38 42h18" stroke={RED} />
    {[64, 74, 84].map((y) => [36, 48, 60].map((x) => <rect key={`${x}${y}`} x={x} y={y} width="8" height="6" rx="1.5" fill={INK} stroke="none" />))}
    <path d="M74 68h16M74 80h16" stroke={INK} />
    <rect x="72" y="88" width="20" height="6" rx="2" fill={RED} stroke="none" />
  </Svg>
)

export const SmartTv = (p) => (
  <Svg {...p}>
    <rect x="8" y="18" width="104" height="66" rx="6" fill={INK} />
    <rect x="14" y="24" width="92" height="54" rx="3" fill={ROSE} stroke="none" />
    <path d="M52 40l18 11-18 11z" fill={RED} stroke="none" />
    <path d="M44 84l-6 14M76 84l6 14M30 98h60" />
  </Svg>
)

export const Lift = (p) => (
  <Svg {...p}>
    <rect x="18" y="8" width="84" height="104" rx="6" fill={WHITE} />
    <rect x="28" y="30" width="30" height="76" fill={ROSE} />
    <rect x="62" y="30" width="30" height="76" fill={ROSE} />
    <path d="M52 20l8-6 8 6" stroke={RED} />
    <path d="M60 34v0" />
  </Svg>
)

export const Microwave = (p) => (
  <Svg {...p}>
    <rect x="8" y="24" width="104" height="70" rx="8" fill={WHITE} />
    <rect x="16" y="32" width="66" height="54" rx="4" fill={ROSE} />
    <path d="M26 44c8-4 14 4 22 0s14 4 22 0" stroke={RED} strokeWidth="2.5" />
    <rect x="88" y="34" width="16" height="10" rx="2" fill={INK} stroke="none" />
    <circle cx="96" cy="62" r="6" />
    <circle cx="96" cy="80" r="4" fill={RED} stroke="none" />
  </Svg>
)

export const Router = (p) => (
  <Svg {...p}>
    <path d="M34 64V30M86 64V30" />
    <rect x="16" y="64" width="88" height="30" rx="8" fill={INK} />
    {[34, 46, 58].map((x) => (
      <circle key={x} cx={x} cy="79" r="3" fill={GREEN} stroke="none" />
    ))}
    <path d="M46 26a20 20 0 0 1 28 0M52 34a11 11 0 0 1 16 0" stroke={RED} />
  </Svg>
)

export const TicketGate = (p) => (
  <Svg {...p}>
    <rect x="12" y="40" width="26" height="70" rx="4" fill={INK} />
    <rect x="82" y="40" width="26" height="70" rx="4" fill={INK} />
    <rect x="17" y="48" width="16" height="10" rx="2" fill={RED} stroke="none" />
    <path d="M38 70h22M82 70H62" stroke={RED} strokeWidth="5" />
    <rect x="44" y="14" width="32" height="20" rx="3" fill={ROSE} />
    <path d="M52 24h16" stroke={RED} />
  </Svg>
)

export const Earbuds = (p) => (
  <Svg {...p}>
    <rect x="18" y="56" width="84" height="46" rx="20" fill={WHITE} />
    <path d="M18 72h84" />
    <circle cx="42" cy="38" r="14" fill={INK} />
    <circle cx="78" cy="38" r="14" fill={INK} />
    <path d="M42 52v14M78 52v14" strokeWidth="6" />
    <circle cx="60" cy="88" r="3" fill={GREEN} stroke="none" />
  </Svg>
)

/* ---------- Input and output ---------- */

export const Keyboard = (p) => (
  <Svg {...p}>
    <rect x="6" y="34" width="108" height="52" rx="8" fill={WHITE} />
    {[44, 56, 68].map((y, r) =>
      Array.from({ length: 8 - r }).map((_, i) => (
        <rect key={`${r}${i}`} x={14 + r * 5 + i * 12} y={y} width="9" height="8" rx="2" fill={i === 2 && r === 1 ? RED : INK} stroke="none" />
      )),
    )}
    <rect x="32" y="78" width="56" height="4" rx="2" fill={INK} stroke="none" />
  </Svg>
)

export const Mouse = (p) => (
  <Svg {...p}>
    <path d="M60 6c0 0 0 14 0 22" stroke={GREY} />
    <rect x="34" y="28" width="52" height="84" rx="26" fill={WHITE} />
    <path d="M34 62h52M60 28v34" />
    <rect x="56" y="38" width="8" height="14" rx="4" fill={RED} stroke="none" />
  </Svg>
)

export const Touch = (p) => (
  <Svg {...p}>
    <rect x="30" y="8" width="60" height="104" rx="10" fill={INK} />
    <rect x="36" y="18" width="48" height="84" rx="4" fill={ROSE} stroke="none" />
    <circle cx="60" cy="58" r="14" stroke={RED} strokeWidth="3" />
    <circle cx="60" cy="58" r="5" fill={RED} stroke="none" />
    <circle cx="60" cy="58" r="22" stroke={RED} strokeWidth="2" opacity="0.4" />
  </Svg>
)

export const Microphone = (p) => (
  <Svg {...p}>
    <rect x="44" y="8" width="32" height="58" rx="16" fill={RED} />
    <path d="M52 24h16M52 34h16M52 44h16" stroke={WHITE} strokeWidth="2.5" />
    <path d="M32 54c0 16 12 28 28 28s28-12 28-28M60 82v20M42 108h36" />
  </Svg>
)

export const Camera = (p) => (
  <Svg {...p}>
    <path d="M40 30l8-12h24l8 12" fill={INK} />
    <rect x="10" y="30" width="100" height="70" rx="10" fill={WHITE} />
    <circle cx="60" cy="65" r="22" fill={ROSE} />
    <circle cx="60" cy="65" r="11" fill={INK} />
    <circle cx="94" cy="44" r="4" fill={RED} stroke="none" />
  </Svg>
)

export const Sensor = (p) => (
  <Svg {...p}>
    <path d="M60 108s-30-30-30-56a30 30 0 0 1 60 0c0 26-30 56-30 56z" fill={RED} />
    <circle cx="60" cy="52" r="11" fill={WHITE} />
  </Svg>
)

export const Monitor = (p) => (
  <Svg {...p}>
    <rect x="8" y="14" width="104" height="70" rx="6" fill={WHITE} />
    <rect x="15" y="21" width="90" height="56" rx="3" fill={ROSE} stroke="none" />
    <rect x="24" y="30" width="34" height="38" rx="3" fill={RED} stroke="none" />
    <path d="M66 34h30M66 44h22M66 54h28" stroke={INK} />
    <path d="M60 84v14M40 104h40" />
  </Svg>
)

export const Speaker = (p) => (
  <Svg {...p}>
    <rect x="28" y="10" width="64" height="100" rx="10" fill={INK} />
    <circle cx="60" cy="36" r="10" fill="#2A2A2F" stroke={GREY} strokeWidth="2" />
    <circle cx="60" cy="76" r="20" fill="#2A2A2F" stroke={GREY} strokeWidth="2" />
    <circle cx="60" cy="76" r="7" fill={RED} stroke="none" />
  </Svg>
)

export const Printer = (p) => (
  <Svg {...p}>
    <rect x="32" y="10" width="56" height="30" rx="3" fill={WHITE} />
    <rect x="10" y="38" width="100" height="44" rx="8" fill={INK} />
    <circle cx="94" cy="52" r="4" fill={GREEN} stroke="none" />
    <rect x="30" y="68" width="60" height="44" rx="3" fill={WHITE} />
    <path d="M40 82h40M40 92h28M40 102h34" stroke={RED} />
  </Svg>
)

export const Vibration = (p) => (
  <Svg {...p}>
    <rect x="40" y="14" width="40" height="92" rx="8" fill={INK} />
    <rect x="45" y="24" width="30" height="70" rx="3" fill={ROSE} stroke="none" />
    <path d="M28 40l-8 8 8 8-8 8 8 8M92 40l8 8-8 8 8 8-8 8" stroke={RED} />
  </Svg>
)

/* ---------- Inside the computer ---------- */

export const Cpu = (p) => (
  <Svg {...p}>
    {[30, 44, 58, 72, 86].map((v) => (
      <g key={v} stroke={GREY}>
        <path d={`M${v} 12v14M${v} 94v14M12 ${v}h14M94 ${v}h14`} />
      </g>
    ))}
    <rect x="26" y="26" width="68" height="68" rx="8" fill={INK} />
    <rect x="38" y="38" width="44" height="44" rx="4" fill={RED} stroke="none" />
    <text x="60" y="66" textAnchor="middle" fontFamily="Space Grotesk, Arial, sans-serif" fontWeight="700" fontSize="16" fill={WHITE} stroke="none">
      CPU
    </text>
  </Svg>
)

export const Ram = (p) => (
  <Svg {...p}>
    <rect x="6" y="36" width="108" height="40" rx="4" fill={GREEN} />
    {[16, 40, 64, 88].map((x) => (
      <rect key={x} x={x} y="44" width="16" height="22" rx="2" fill={INK} stroke="none" />
    ))}
    {Array.from({ length: 16 }).map((_, i) => (
      <rect key={i} x={12 + i * 6.4} y="80" width="3.5" height="8" fill={AMBER} stroke="none" />
    ))}
    <path d="M6 76h108v12" stroke={INK} />
  </Svg>
)

export const Ssd = (p) => (
  <Svg {...p}>
    <rect x="14" y="26" width="92" height="68" rx="6" fill={INK} />
    <rect x="24" y="36" width="52" height="24" rx="3" fill={RED} stroke="none" />
    <text x="50" y="53" textAnchor="middle" fontFamily="Space Grotesk, Arial, sans-serif" fontWeight="700" fontSize="13" fill={WHITE} stroke="none">
      SSD
    </text>
    <path d="M24 74h44M24 82h30" stroke={GREY} />
    <circle cx="92" cy="80" r="4" fill={GREEN} stroke="none" />
  </Svg>
)

export const Gear = (p) => (
  <Svg {...p}>
    <path
      d="M60 18l7 2 3 10 9 4 9-5 7 7-5 9 4 9 10 3v10l-10 3-4 9 5 9-7 7-9-5-9 4-3 10H53l-3-10-9-4-9 5-7-7 5-9-4-9-10-3V60l10-3 4-9-5-9 7-7 9 5 9-4 3-10z"
      fill={RED}
    />
    <circle cx="60" cy="60" r="14" fill={WHITE} />
  </Svg>
)

export const Desk = (p) => (
  <Svg {...p}>
    <path d="M8 56h104M18 56v52M102 56v52M70 56v34h32" />
    <rect x="22" y="30" width="30" height="24" rx="2" fill={WHITE} transform="rotate(-6 37 42)" />
    <rect x="50" y="34" width="30" height="20" rx="2" fill={ROSE} transform="rotate(5 65 44)" />
    <path d="M28 40h16M28 46h12" stroke={RED} strokeWidth="2" transform="rotate(-6 37 42)" />
    <path d="M86 52l6-18 6 18" fill={AMBER} />
  </Svg>
)

export const Cupboard = (p) => (
  <Svg {...p}>
    <rect x="20" y="8" width="80" height="104" rx="6" fill={WHITE} />
    {[10, 42, 74].map((y) => (
      <g key={y}>
        <rect x="28" y={y + 8} width="64" height="26" rx="3" fill={ROSE} />
        <path d={`M52 ${y + 21}h16`} stroke={RED} strokeWidth="4" />
      </g>
    ))}
  </Svg>
)

/* ---------- Software ---------- */

export const BrowserWindow = (p) => (
  <Svg {...p}>
    <rect x="8" y="16" width="104" height="88" rx="8" fill={WHITE} />
    <path d="M8 34h104" />
    <circle cx="20" cy="25" r="3" fill={RED} stroke="none" />
    <circle cx="30" cy="25" r="3" fill={AMBER} stroke="none" />
    <circle cx="40" cy="25" r="3" fill={GREEN} stroke="none" />
    <rect x="18" y="44" width="84" height="22" rx="3" fill={RED} stroke="none" />
    <rect x="18" y="72" width="26" height="22" rx="3" fill={ROSE} stroke="none" />
    <rect x="47" y="72" width="26" height="22" rx="3" fill={ROSE} stroke="none" />
    <rect x="76" y="72" width="26" height="22" rx="3" fill={ROSE} stroke="none" />
  </Svg>
)

export const CodeEditor = (p) => (
  <Svg {...p}>
    <rect x="8" y="16" width="104" height="88" rx="8" fill={INK} />
    <path d="M8 34h104" stroke="#3A3A40" />
    <circle cx="20" cy="25" r="3" fill={RED} stroke="none" />
    <path d="M22 48h20M48 48h28" stroke="#FF7A80" />
    <path d="M30 60h36" stroke="#9FDCA3" />
    <path d="M30 72h22M58 72h18" stroke="#9CC4FF" />
    <path d="M22 84h14" stroke="#FF7A80" />
    <rect x="80" y="80" width="3" height="10" fill={WHITE} stroke="none" />
  </Svg>
)

export const OsWindows = (p) => (
  <Svg {...p}>
    <rect x="14" y="14" width="92" height="92" rx="12" fill={INK} />
    <rect x="26" y="26" width="32" height="32" rx="3" fill={RED} stroke="none" />
    <rect x="62" y="26" width="32" height="32" rx="3" fill={WHITE} stroke="none" />
    <rect x="26" y="62" width="32" height="32" rx="3" fill={WHITE} stroke="none" />
    <rect x="62" y="62" width="32" height="32" rx="3" fill={RED} stroke="none" />
  </Svg>
)

export const Instructions = (p) => (
  <Svg {...p}>
    <rect x="20" y="8" width="80" height="104" rx="6" fill={WHITE} />
    {[26, 46, 66, 86].map((y, i) => (
      <g key={y}>
        <circle cx="34" cy={y + 4} r="7" fill={RED} stroke="none" />
        <text x="34" y={y + 8.5} textAnchor="middle" fontFamily="Space Grotesk, Arial, sans-serif" fontWeight="700" fontSize="11" fill={WHITE} stroke="none">
          {i + 1}
        </text>
        <path d={`M48 ${y + 4}h40`} />
      </g>
    ))}
  </Svg>
)

/* ---------- Ideas ---------- */

export const Person = (p) => (
  <Svg {...p}>
    <circle cx="60" cy="36" r="18" fill={ROSE} />
    <path d="M24 108c0-22 16-38 36-38s36 16 36 38z" fill={RED} />
  </Svg>
)

export const Clock = (p) => (
  <Svg {...p}>
    <circle cx="60" cy="62" r="44" fill={WHITE} />
    <path d="M60 34v28l18 12" stroke={RED} strokeWidth="5" />
    <path d="M44 10h32M60 10v8" />
  </Svg>
)

export const Lightning = (p) => (
  <Svg {...p}>
    <path d="M68 8L28 66h28l-6 46 42-62H64z" fill={AMBER} />
  </Svg>
)
