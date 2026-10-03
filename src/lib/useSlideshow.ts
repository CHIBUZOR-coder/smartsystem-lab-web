import { useEffect, useState } from 'react'

// Auto-advances through `length` items, looping; does nothing for 0 or 1 items.
// Returns the current index and a setter (e.g. to skip forward past a broken image).
export function useSlideshow(length: number, intervalMs = 3500) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [length])

  useEffect(() => {
    if (length <= 1) return
    const id = setInterval(() => setIndex(i => (i + 1) % length), intervalMs)
    return () => clearInterval(id)
  }, [length, intervalMs])

  return [index, setIndex] as const
}
