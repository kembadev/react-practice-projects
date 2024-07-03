export async function getMatrixRepresentionOfQuantaFromFlatTypedArray ({ imageBytes, canvasWidth, offset }) {
  const arrayOfRows = []

  for (let y = 0; y < imageBytes.length; y += (canvasWidth * offset)) {
    const rowOfValues = [...imageBytes.slice(y, y + canvasWidth * offset)]

    const rowOfPixels = []
    for (let x = 0; x < rowOfValues.length; x += offset) {
      rowOfPixels.push(rowOfValues.slice(x, x + offset))
    }

    arrayOfRows.push(rowOfPixels)
  }

  return arrayOfRows
}
