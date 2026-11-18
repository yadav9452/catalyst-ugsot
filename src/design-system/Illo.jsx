import * as illustrations from './illustrations'

/** Render an illustration by name, e.g. from lecture data: <Illo name="Laptop" size={80} /> */
export default function Illo({ name, ...props }) {
  const C = illustrations[name]
  return C ? <C {...props} /> : null
}
