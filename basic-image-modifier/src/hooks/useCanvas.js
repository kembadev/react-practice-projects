import { useContext } from 'react'
import { CanvasContext } from '../context/canvas.jsx'

export function useCanvas () {
  const context = useContext(CanvasContext)

  if (context === undefined) {
    throw new Error('useCanvas must be within a CanvasProvider')
  }

  const {
    canvas,
    canvasContainer,
    ctx,
    setCtx,
    scaling,
    setScaling,
    userImgElement,
    setUserImgElement,
    canvasOrientation,
    setCanvasOrientation,
    currentCanvasDimensions,
    setCurrentCanvasDimensions,
    resetCanvas
  } = context

  return {
    canvas,
    canvasContainer,
    ctx,
    setCtx,
    scaling,
    setScaling,
    userImgElement,
    setUserImgElement,
    canvasOrientation,
    setCanvasOrientation,
    currentCanvasDimensions,
    setCurrentCanvasDimensions,
    resetCanvas
  }
}
