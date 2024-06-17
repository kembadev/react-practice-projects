import './Canvas.css'

import { ORIENTATION_TYPE } from '../consts.js'

import { useEffect } from 'react'

import { useCanvas } from '../hooks/useCanvas.js'
import { useImageBytes } from '../hooks/useImageBytes.js'

export function Canvas () {
  const { canvas, ctx, canvasInitialDimensions, canvasOrientation } = useCanvas()
  const { currentImageBytes } = useImageBytes()

  useEffect(() => {
    if (!currentImageBytes) return

    const { initialHeight, initialWidth } = canvasInitialDimensions

    let canvasImageData
    if (canvasOrientation === ORIENTATION_TYPE.INITIAL) {
      canvasImageData = ctx.createImageData(initialWidth, initialHeight)
    } else {
      canvasImageData = ctx.createImageData(initialHeight, initialWidth)
    }

    canvasImageData.data.set(currentImageBytes)
    ctx.putImageData(canvasImageData, 0, 0)
  }, [currentImageBytes, canvasOrientation])

  return (
    <div className="canvasContainer">
      <canvas ref={canvas} />
    </div>
  )
}
