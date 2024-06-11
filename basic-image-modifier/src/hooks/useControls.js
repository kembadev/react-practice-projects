import { useState } from 'react'
import { setRotation } from '../methods/rotate.js'
import { setInvertion } from '../methods/invert.js'
import { DIRECTION, ORIENTATION_TYPE } from '../consts.js'

export function useControls ({ canvas, ctx, imageFile, imgElement }) {
  const [canvasInitialDimensions, setCanvasInitialDimensions] = useState({ height: 0, width: 0 })
  const [canvasOrientation, setCanvasOrientation] = useState(ORIENTATION_TYPE.INITIAL)

  const invertImage = () => {
    setInvertion({
      ctx,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    })
  }

  const updateImageOrientation = (direction) => {
    setRotation({
      canvas,
      ctx,
      initialWidth: canvasInitialDimensions.width,
      initialHeight: canvasInitialDimensions.height,
      direction,
      orientationType: canvasOrientation
    })

    setCanvasOrientation(prevType => (
      prevType === ORIENTATION_TYPE.INITIAL ? ORIENTATION_TYPE.TWISTED : ORIENTATION_TYPE.INITIAL
    ))
  }

  const rotateToLeft = () => {
    updateImageOrientation(DIRECTION.LEFT)
  }

  const rotateToRight = () => {
    updateImageOrientation(DIRECTION.RIGHT)
  }

  return { setCanvasInitialDimensions, invertImage, rotateToLeft, rotateToRight, setCanvasOrientation }
}
