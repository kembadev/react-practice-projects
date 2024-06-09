import { useState } from 'react'
import { setRotation } from '../methods/rotate.js'
import { setInvertion } from '../methods/invert.js'
import { DIRECTION } from '../consts.js'

export function useControls ({ canvas, ctx, imageFile, imgElement }) {
  const [originalDimensions, setOriginalDimensions] = useState({ height: 0, width: 0 })

  const updateCanvas = (action) => {
    action(ctx)
  }

  const invertImage = () => {
    updateCanvas((ctx) => {
      setInvertion({
        ctx,
        width: originalDimensions.width,
        height: originalDimensions.height
      })
    })
  }

  const rotateToLeft = () => {
    updateCanvas((ctx) => {
      setRotation({
        ctx,
        width: originalDimensions.width,
        height: originalDimensions.height,
        direction: DIRECTION.LEFT
      })
    })
  }

  const rotateToRight = () => {
    updateCanvas((ctx) => {
      setRotation({
        ctx,
        width: originalDimensions.width,
        height: originalDimensions.height,
        direction: DIRECTION.RIGHT
      })
    })
  }

  return { setOriginalDimensions, invertImage, rotateToLeft, rotateToRight }
}
