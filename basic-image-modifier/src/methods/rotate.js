import { getImageBytesFromContext } from './imageBytes.js'
import { DIRECTION, ORIENTATION_TYPE } from '../consts.js'

async function getRotatedImageBytes ({ imageBytes, canvasWidth, canvasHeight, direction }) {
  const imageBytesMatrix = []
  // each pixel is represented by four values within the imageBytes array
  for (let y = 0; y < imageBytes.length; y += (canvasWidth * 4)) {
    const rowOfValues = [...imageBytes.slice(y, y + canvasWidth * 4)]

    const rowOfPixels = []
    for (let x = 0; x < rowOfValues.length; x += 4) {
      rowOfPixels.push(rowOfValues.slice(x, x + 4))
    }

    imageBytesMatrix.push(rowOfPixels)
  } // create an ordered array from imageBytes

  const rotatedImageBytesMatrix = []
  if (direction === DIRECTION.LEFT) {
    for (let pixelIndex = canvasWidth - 1; pixelIndex >= 0; pixelIndex--) {
      const newRowOfPixels = []
      for (let rowIndex = 0; rowIndex < canvasHeight; rowIndex++) {
        // take off the nth pixel of each row and get it into newRowOfPixels
        newRowOfPixels.push(imageBytesMatrix[rowIndex][pixelIndex])
      }

      rotatedImageBytesMatrix.push(newRowOfPixels)
    }
  } else {
    for (let pixelIndex = 0; pixelIndex < canvasWidth; pixelIndex++) {
      const newRowOfPixels = []
      for (let rowIndex = canvasHeight - 1; rowIndex >= 0; rowIndex--) {
        newRowOfPixels.push(imageBytesMatrix[rowIndex][pixelIndex])
      }

      rotatedImageBytesMatrix.push(newRowOfPixels)
    }
  }

  return new Uint8Array(rotatedImageBytesMatrix.flat(2))
}

export function setRotation ({ canvas, ctx, initialWidth, initialHeight, direction, orientationType }) {
  getImageBytesFromContext({ ctx, canvasWidth: canvas.width, canvasHeight: canvas.height })
    .then(imageBytes => getRotatedImageBytes({
      imageBytes,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      direction
    }))
    .then(rotatedImageBytes => {
      // toggle canvas's dimensions due to rotation
      let canvasImageData
      if (orientationType === ORIENTATION_TYPE.INITIAL) {
        canvas.width = initialHeight
        canvas.height = initialWidth
        canvasImageData = ctx.createImageData(initialHeight, initialWidth)
      } else {
        canvas.width = initialWidth
        canvas.height = initialHeight
        canvasImageData = ctx.createImageData(initialWidth, initialHeight)
      }
      canvasImageData.data.set(rotatedImageBytes)
      ctx.putImageData(canvasImageData, 0, 0)
    })
}
