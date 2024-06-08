import { useEffect, useState } from 'react'

export function useControls (canvas) {
  const [scale, setScale] = useState(1)
  const [originalDimensions, setOriginalDimensions] = useState({ height: 0, width: 0 })

  const updateScale = (e) => {
    setScale(e.target.value)
  }

  useEffect(() => {
    if (!canvas) return

    const { height, width } = originalDimensions
    canvas.height = height * scale
    canvas.width = width * scale
  }, [scale])

  return { scale, updateScale, setOriginalDimensions }
}
