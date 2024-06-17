import { ORIENTATION_TYPE } from '../consts.js'

export function getCurrentCanvasDimensions ({ canvasOrientation, canvasInitialDimensions }) {
  const { initialHeight, initialWidth } = canvasInitialDimensions

  const canvasWidth = canvasOrientation === ORIENTATION_TYPE.INITIAL
    ? initialWidth
    : initialHeight

  const canvasHeight = canvasOrientation === ORIENTATION_TYPE.INITIAL
    ? initialHeight
    : initialWidth

  return { canvasHeight, canvasWidth }
}
