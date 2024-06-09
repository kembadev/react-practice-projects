import { getImageBytesFromContext } from './imageBytes.js'
import { DIRECTION } from '../consts.js'

async function getRotatedImageBytes ({ imageBytes, width, height, direction }) {
  const imageBytesMatrix = []
  // each pixel is represented by four values within the imageBytes array
  for (let y = 0; y < imageBytes.length; y += (width * 4)) {
    const rowOfValues = [...imageBytes.slice(y, y + width * 4)]

    const rowOfPixels = []
    for (let x = 0; x < rowOfValues.length; x += 4) {
      rowOfPixels.push(rowOfValues.slice(x, x + 4))
    }

    imageBytesMatrix.push(rowOfPixels)
  } // create an ordered array from imageBytes

  const rotatedImageBytesMatrix = []
  if (direction === DIRECTION.LEFT) {
    for (let pixelIndex = width - 1; pixelIndex >= 0; pixelIndex--) {
      const newRowOfPixels = []
      for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        // take off the nth pixel of each row and get it into newRowOfPixels
        newRowOfPixels.push(imageBytesMatrix[rowIndex][pixelIndex])
      }

      rotatedImageBytesMatrix.push(newRowOfPixels)
    }
  } else {
    for (let pixelIndex = 0; pixelIndex < width; pixelIndex++) {
      const newRowOfPixels = []
      for (let rowIndex = height - 1; rowIndex >= 0; rowIndex--) {
        newRowOfPixels.push(imageBytesMatrix[rowIndex][pixelIndex])
      }

      rotatedImageBytesMatrix.push(newRowOfPixels)
    }
  }

  return new Uint8Array(rotatedImageBytesMatrix.flat(2))
}

export function setRotation ({ ctx, width, height, direction }) {
  getImageBytesFromContext({ ctx, width, height })
    .then(imageBytes => getRotatedImageBytes({ imageBytes, width, height, direction }))
    .then(rotatedImageBytes => {
      const canvasImageData = ctx.createImageData(width, height)
      canvasImageData.data.set(rotatedImageBytes)
      ctx.putImageData(canvasImageData, 0, 0)
    })
}
