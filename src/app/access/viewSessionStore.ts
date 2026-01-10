import { getActiveView } from "./viewSession"

type Listener = () => void

let listeners: Listener[] = []

export function subscribe(callback: Listener) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((l) => l !== callback)
  }
}

export function emitChange() {
  for (const l of listeners) l()
}

export function getSnapshot() {
  return getActiveView()
}

// 👇 Server snapshot MUST be deterministic
export function getServerSnapshot() {
  return null
}
