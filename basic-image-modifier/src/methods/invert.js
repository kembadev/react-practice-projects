import { getImageBytesFromContext } from './imageBytes'

async function getImageBytesXAxisInverted ({ imageBytes, width, height }) {
  const imageBytesMatrix = []
  for (let i = 0; i < imageBytes.length; i += (width * 4)) {
    const rowOfValues = []
    for (let x = 0; x < (width * 4); x++) {
      rowOfValues.push(imageBytes[x + i])
    }

    imageBytesMatrix.push(rowOfValues)
  }

  const newImageBytes = []

  for (let y = 0; y < height; y++) {
    const reversedPixelsRow = []

    for (let x = 0; x < (width * 4); x += 4) {
      const pixel = []
      let valuePosition = 0
      while (valuePosition < 4) {
        pixel.push(imageBytesMatrix[y][x + valuePosition])
        valuePosition++
      }

      reversedPixelsRow.push(pixel)
    }

    newImageBytes.push(reversedPixelsRow.toReversed().flat())
  }

  return new Uint8Array(newImageBytes.flat())
}

export function setInvertion ({ ctx, width, height }) {
  getImageBytesFromContext({ ctx, width, height })
    .then(imageBytes => getImageBytesXAxisInverted({ imageBytes, width, height }))
    .then(invertedImageBytes => {
      const canvasImageData = ctx.createImageData(width, height)
      canvasImageData.data.set(invertedImageBytes)
      ctx.putImageData(canvasImageData, 0, 0)
    })
}
