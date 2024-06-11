import { LONGEST_SIDE } from '../consts.js'

export async function getCanvasResize ({ imgHeight, imgWidth, parentHeight, parentWidth }) {
  const longestSideOfImgElement = [imgHeight, imgWidth].findIndex(
    length => length === Math.max(imgHeight, imgWidth)
  ) === 0
    ? LONGEST_SIDE.HEIGHT
    : LONGEST_SIDE.WIDTH

  const canvasMaxSideLimit = Math.min(parentHeight, parentWidth)

  const isImgHigherThanParent = imgHeight > parentHeight
  const isImgWiderThanParent = imgWidth > parentWidth
  let finalCanvasHeight = imgHeight
  let finalCanvasWidth = imgWidth

  if (longestSideOfImgElement === LONGEST_SIDE.HEIGHT) {
    if (isImgHigherThanParent) {
      // the shortest side of the parent element (canvasMaxSideLimit) must also be
      // the longest side (either height or width) of the canvas
      while (finalCanvasHeight >= canvasMaxSideLimit) {
        finalCanvasWidth--
        finalCanvasHeight = (finalCanvasWidth / imgWidth) * imgHeight
      }
    } else if (isImgWiderThanParent) {
      while (finalCanvasHeight >= canvasMaxSideLimit) {
        finalCanvasHeight--
        finalCanvasWidth = (finalCanvasHeight / imgHeight) * imgWidth
      }
    }
  } else {
    if (isImgWiderThanParent) {
      while (finalCanvasWidth >= canvasMaxSideLimit) {
        finalCanvasWidth--
        finalCanvasHeight = (finalCanvasWidth / imgWidth) * imgHeight
      }
    } else if (isImgHigherThanParent) {
      while (finalCanvasWidth >= canvasMaxSideLimit) {
        finalCanvasHeight--
        finalCanvasWidth = (finalCanvasHeight / imgHeight) * imgWidth
      }
    }
  }

  return { finalCanvasHeight, finalCanvasWidth }
}
