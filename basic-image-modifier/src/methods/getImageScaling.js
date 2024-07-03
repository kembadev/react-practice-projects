export async function getImageScaling ({ originalHeight, originalWidth, containerHeight, containerWidth }) {
  const basicScaling = Math.min(containerWidth / originalWidth, containerHeight / originalHeight)

  let finalCanvasWidth = originalWidth * basicScaling
  let finalCanvasHeight = originalHeight * basicScaling

  const isFinalCanvasHeightLongestThanItsWidth = finalCanvasHeight > finalCanvasWidth

  const maxCanvasSideLength = Math.min(containerHeight, containerWidth)

  while (finalCanvasWidth > maxCanvasSideLength || finalCanvasHeight > maxCanvasSideLength) {
    if (isFinalCanvasHeightLongestThanItsWidth) {
      finalCanvasHeight--
      finalCanvasWidth = (finalCanvasHeight / originalHeight) * originalWidth
    } else {
      finalCanvasWidth--
      finalCanvasHeight = (finalCanvasWidth / originalWidth) * originalHeight
    }
  }

  return { scaleY: finalCanvasHeight / originalHeight, scaleX: finalCanvasWidth / originalWidth }
}
