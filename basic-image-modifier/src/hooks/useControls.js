import { useState } from 'react'

export function useControls ({ canvas, imageFile, imgElement }) {
  const [originalDimensions, setOriginalDimensions] = useState({ height: 0, width: 0 })

  const updateCanvas = async (action) => {
    const ctx = canvas.getContext('2d')
    action(ctx)
  }

  const invertImage = () => {
    updateCanvas((ctx) => {
      // (x, y) => (a*x + c*y + e, b*x + d*y + f)
      // a*x + c*y + e = canvas_width - x /=> to invert horizontally
      // -1*x + 0*y + canvas_width = canvas_width - x
      ctx.transform(-1, 0, 0, 1, canvas.width, 0) // horizontal invertion
      // ctx.transform(1, 0, 0, -1, 0, canvas.height) for vertical invertion

      ctx.drawImage(imgElement, 0, 0)
    })
  }

  return { setOriginalDimensions, invertImage }
}
