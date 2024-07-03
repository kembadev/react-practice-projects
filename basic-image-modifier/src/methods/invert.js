import { getMatrixRepresentionOfQuantaFromFlatTypedArray } from './getOrderedTypedArray.js'

export async function getImageBytesXAxisInverted ({ imageBytes, canvasWidth }) {
  const imageBytesMatrix = await getMatrixRepresentionOfQuantaFromFlatTypedArray({ imageBytes, canvasWidth, offset: 4 })

  const newImageBytes = []

  imageBytesMatrix.forEach(row => {
    newImageBytes.push(row.toReversed())
  })

  return new Uint8Array(newImageBytes.flat(2))
}
