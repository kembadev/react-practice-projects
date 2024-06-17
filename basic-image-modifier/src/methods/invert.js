export async function getImageBytesXAxisInverted ({ imageBytes, canvasWidth, canvasHeight }) {
  const imageBytesMatrix = []
  for (let i = 0; i < imageBytes.length; i += (canvasWidth * 4)) {
    const rowOfValues = []
    for (let x = 0; x < (canvasWidth * 4); x++) {
      rowOfValues.push(imageBytes[x + i])
    }

    imageBytesMatrix.push(rowOfValues)
  }

  const newImageBytes = []

  for (let y = 0; y < canvasHeight; y++) {
    const reversedPixelsRow = []

    for (let x = 0; x < (canvasWidth * 4); x += 4) {
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
