import './Canvas.css'

import { ORIENTATION_TYPE } from '../consts.js'
import { initialTool } from './tools.jsx'

import { OverlayCanvas } from './OverlayCanvas.jsx'

import { useEffect } from 'react'
import { useCanvas } from '../hooks/useCanvas.js'
import { useImageBytes } from '../hooks/useImageBytes.js'
import { useTools } from '../hooks/useTools.js'

export function Canvas () {
  const {
    canvas,
    canvasContainer,
    currentCanvasDimensions,
    ctx,
    scaling,
    canvasOrientation
  } = useCanvas()
  const { currentImageBytes } = useImageBytes()
  const { toolSelected } = useTools()

  useEffect(() => {
    const { width: newCanvasWidth, height: newCanvasHeight } = currentCanvasDimensions

    if (!newCanvasWidth || !newCanvasHeight) return

    canvas.current.width = newCanvasWidth
    canvas.current.height = newCanvasHeight
  }, [canvas, currentCanvasDimensions])

  useEffect(() => {
    if (!currentImageBytes) return

    const { width: canvasWidth, height: canvasHeight } = canvas.current

    ctx.setTransform(1, 0, 0, 1, 0, 0)

    if (canvasOrientation === ORIENTATION_TYPE.INITIAL) {
      ctx.scale(scaling.x, scaling.y)
    } else {
      ctx.scale(scaling.y, scaling.x)
    }

    const canvasImageData = ctx.createImageData(canvasWidth, canvasHeight)
    canvasImageData.data.set(currentImageBytes)
    ctx.putImageData(canvasImageData, 0, 0)
  }, [currentImageBytes, canvas, canvasOrientation, ctx, scaling])

  return (
    <div className="canvasContainer" style={{ position: 'relative' }} ref={canvasContainer}>
      {toolSelected === initialTool && <OverlayCanvas />}
      <canvas ref={canvas} />
    </div>
  )
}
