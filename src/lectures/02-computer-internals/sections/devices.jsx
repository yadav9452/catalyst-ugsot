/*
 * Device pictures for Lecture 2.
 * <DevicePic id="mouse" /> shows a photo from assets/lecture2/ (mouse.jpg, mouse.png…) when there is one,
 * otherwise one of the drawings below, drawn in the same style as the shared illustration library.
 */
import { Camera, Cpu, Gamepad, Keyboard, Microphone, Monitor, Mouse, Ram, Ssd, Touch } from '../../../design-system/illustrations'
import { photos, pic } from '../images'

const INK = '#1A1A1A'
const RED = '#E00C16'
const ROSE = '#FCE6E7'
const WHITE = '#FFFFFF'
const GREY = '#C9C9D1'
const AMBER = '#F5B841'
const GREEN = '#2E9D6B'
const BLUE = '#9CC4FF'

function Svg({ size = 96, children }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className="illo"
      aria-hidden="true"
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

export const Trackpad = (p) => (
  <Svg {...p}>
    <rect x="8" y="30" width="104" height="62" rx="10" fill={WHITE} />
    <rect x="34" y="40" width="52" height="34" rx="6" fill={ROSE} />
    <path d="M34 82h52" stroke={GREY} />
    <circle cx="66" cy="56" r="5" fill={RED} stroke="none" />
    <path d="M66 56c6-6 14-6 18 0" stroke={RED} strokeWidth="2" opacity="0.5" />
  </Svg>
)

export const Webcam = (p) => (
  <Svg {...p}>
    <rect x="22" y="22" width="76" height="52" rx="26" fill={INK} />
    <circle cx="60" cy="48" r="18" fill={WHITE} />
    <circle cx="60" cy="48" r="10" fill={BLUE} />
    <circle cx="60" cy="48" r="4" fill={INK} stroke="none" />
    <circle cx="86" cy="36" r="3" fill={RED} stroke="none" />
    <path d="M60 74v14M40 98h40l-6-10H46z" fill={GREY} />
  </Svg>
)

export const Scanner = (p) => (
  <Svg {...p}>
    <path d="M14 40l14-14h64l14 14" fill={GREY} />
    <rect x="8" y="40" width="104" height="48" rx="8" fill={WHITE} />
    <rect x="18" y="50" width="84" height="12" rx="3" fill={ROSE} stroke="none" />
    <path d="M18 56h84" stroke={RED} strokeWidth="4" />
    <circle cx="96" cy="76" r="4" fill={GREEN} stroke="none" />
    <path d="M20 76h40" stroke={GREY} />
  </Svg>
)

export const BarcodeScanner = (p) => (
  <Svg {...p}>
    <path d="M24 30h52l14 20-20 8-10 44H40l6-44-22-8z" fill={INK} />
    <path d="M90 50l20-12M90 50l20 0M90 50l20 12" stroke={RED} strokeWidth="2.5" />
    <rect x="44" y="64" width="12" height="20" rx="3" fill={AMBER} stroke="none" />
  </Svg>
)

export const Hdd = (p) => (
  <Svg {...p}>
    <rect x="14" y="10" width="92" height="100" rx="8" fill={GREY} />
    <circle cx="58" cy="52" r="32" fill={WHITE} />
    <circle cx="58" cy="52" r="22" stroke={GREY} strokeWidth="2" />
    <circle cx="58" cy="52" r="6" fill={INK} />
    <path d="M94 20L70 64" stroke={INK} strokeWidth="5" />
    <circle cx="94" cy="20" r="5" fill={RED} stroke="none" />
    <rect x="26" y="92" width="44" height="8" rx="2" fill={GREEN} stroke="none" />
  </Svg>
)

export const ExternalHdd = (p) => (
  <Svg {...p}>
    <rect x="28" y="12" width="64" height="92" rx="12" fill={INK} />
    <rect x="38" y="24" width="44" height="30" rx="4" fill={RED} stroke="none" />
    <circle cx="60" cy="88" r="4" fill={GREEN} stroke="none" />
    <path d="M60 104v8" stroke={GREY} strokeWidth="5" />
  </Svg>
)

export const Pendrive = (p) => (
  <Svg {...p}>
    <rect x="44" y="8" width="32" height="26" rx="3" fill={GREY} />
    <rect x="52" y="16" width="6" height="6" fill={INK} stroke="none" />
    <rect x="62" y="16" width="6" height="6" fill={INK} stroke="none" />
    <rect x="36" y="34" width="48" height="78" rx="12" fill={RED} />
    <circle cx="60" cy="96" r="5" fill={WHITE} />
  </Svg>
)

export const SdCard = (p) => (
  <Svg {...p}>
    <path d="M32 10h44l16 16v84H32z" fill={INK} />
    <path d="M44 14v16M54 14v16M64 14v16M74 18v12" stroke={AMBER} strokeWidth="4" />
    <rect x="40" y="52" width="44" height="40" rx="4" fill={WHITE} stroke="none" />
    <text x="62" y="78" textAnchor="middle" fontFamily="Space Grotesk, Arial, sans-serif" fontWeight="700" fontSize="14" fill={RED} stroke="none">
      SD
    </text>
  </Svg>
)

export const Disc = (p) => (
  <Svg {...p}>
    <circle cx="60" cy="60" r="50" fill={GREY} />
    <path d="M60 10a50 50 0 0 1 43 25L60 60z" fill={BLUE} stroke="none" opacity="0.8" />
    <path d="M60 110a50 50 0 0 1-43-25L60 60z" fill={ROSE} stroke="none" />
    <circle cx="60" cy="60" r="50" />
    <circle cx="60" cy="60" r="14" fill={WHITE} />
    <circle cx="60" cy="60" r="5" fill={INK} stroke="none" />
  </Svg>
)

export const Cloud = (p) => (
  <Svg {...p}>
    <path d="M34 84h56a20 20 0 0 0 2-40 28 28 0 0 0-54-6 22 22 0 0 0-4 46z" fill={WHITE} />
    <path d="M60 54v24M50 64l10-10 10 10" stroke={RED} strokeWidth="4" />
  </Svg>
)

export const RomChip = (p) => (
  <Svg {...p}>
    <rect x="28" y="26" width="64" height="68" rx="6" fill={INK} />
    {[36, 48, 60, 72, 84].map((y) => (
      <g key={y}>
        <path d={`M18 ${y}h10M92 ${y}h10`} stroke={GREY} strokeWidth="4" />
      </g>
    ))}
    <text x="60" y="66" textAnchor="middle" fontFamily="Space Grotesk, Arial, sans-serif" fontWeight="700" fontSize="16" fill={WHITE} stroke="none">
      ROM
    </text>
    <circle cx="38" cy="36" r="3" fill={RED} stroke="none" />
  </Svg>
)

/** Registers and cache: tiny boxes inside the CPU chip. */
// Inside the CPU chip. `focus` dims the part that isn't being talked about.
export const CpuInsideMemory = ({ focus, ...p }) => (
  <Svg {...p}>
    <rect x="14" y="14" width="92" height="92" rx="10" fill={INK} />
    <g opacity={focus === 'registers' ? 0.3 : 1}>
      <rect x="24" y="24" width="72" height="30" rx="4" fill={AMBER} stroke="none" />
      <text x="60" y="44" textAnchor="middle" fontFamily="Space Grotesk, Arial, sans-serif" fontWeight="700" fontSize="12" fill={INK} stroke="none">
        CACHE
      </text>
    </g>
    <g opacity={focus === 'cache' ? 0.3 : 1}>
      {[26, 44, 62, 80].map((x) => (
        <rect key={x} x={x} y="66" width="14" height="14" rx="2" fill={RED} stroke="none" />
      ))}
      <text x="60" y="96" textAnchor="middle" fontFamily="Space Grotesk, Arial, sans-serif" fontWeight="700" fontSize="9" fill={WHITE} stroke="none">
        REGISTERS
      </text>
    </g>
  </Svg>
)
const CacheChip = (p) => <CpuInsideMemory focus="cache" {...p} />
const RegisterChip = (p) => <CpuInsideMemory focus="registers" {...p} />

// Photo first (assets/lecture2/<id>.*), then a stored Lecture 1 photo, then a drawing.
const devices = {
  keyboard: { Draw: Keyboard },
  mouse: { Draw: Mouse },
  trackpad: { Draw: Trackpad },
  touchscreen: { photo: photos.mobile, Draw: Touch },
  microphone: { Draw: Microphone },
  webcam: { Draw: Webcam },
  scanner: { Draw: Scanner },
  'barcode-scanner': { Draw: BarcodeScanner },
  camera: { Draw: Camera },
  gamepad: { Draw: Gamepad },
  cpu: { photo: photos.cpu, Draw: Cpu },
  ram: { photo: photos.ram, Draw: Ram },
  rom: { Draw: RomChip },
  cache: { Draw: CacheChip },
  registers: { Draw: RegisterChip },
  ssd: { photo: photos.ssd, Draw: Ssd },
  hdd: { Draw: Hdd },
  'external-hdd': { Draw: ExternalHdd },
  pendrive: { Draw: Pendrive },
  'memory-card': { Draw: SdCard },
  'cd-dvd': { Draw: Disc },
  cloud: { Draw: Cloud },
  monitor: { photo: photos.monitor, Draw: Monitor },
}

export function DevicePic({ id, alt = '', size = 120, className = '' }) {
  const d = devices[id] ?? {}
  const src = pic(id) ?? d.photo
  if (src) return <img className={`dev-photo ${className}`} src={src} alt={alt} loading="lazy" />
  const Draw = d.Draw
  return Draw ? <Draw size={size} /> : null
}
