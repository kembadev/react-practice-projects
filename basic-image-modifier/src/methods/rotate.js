import { DIRECTION } from '../consts.js'

export async function getRotatedImageBytes ({ imageBytes, canvasWidth, canvasHeight, direction }) {
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
        // take the nth pixel from each row and get it into newRowOfPixels
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
