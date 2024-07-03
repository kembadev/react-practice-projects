import { DIRECTION } from '../consts.js'
import { getMatrixRepresentionOfQuantaFromFlatTypedArray } from './getOrderedTypedArray.js'

export async function getRotatedImageBytes ({ imageBytes, canvasWidth, canvasHeight, direction }) {
  const imageBytesMatrix = await getMatrixRepresentionOfQuantaFromFlatTypedArray({ imageBytes, canvasWidth, offset: 4 })

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
