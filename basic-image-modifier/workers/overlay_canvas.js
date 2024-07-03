import { getMatrixRepresentionOfQuantaFromFlatTypedArray } from '../src/methods/getOrderedTypedArray.js'
import { Result } from '../src/utils.js'

onmessage = async e => {
  const {
    currentImageBytes,
    canvasWidth,
    fieldThresholdCoords,
    newOverlayCanvasWidth,
    newOverlayCanvasHeight
  } = e.data

  const canvas = new OffscreenCanvas(newOverlayCanvasWidth, newOverlayCanvasHeight)
  const ctx = canvas.getContext('2d')

  const orderedImageBytes = await getMatrixRepresentionOfQuantaFromFlatTypedArray({
    imageBytes: currentImageBytes,
    canvasWidth,
    offset: 4
  })

  const { P_A, P_B, P_C } = fieldThresholdCoords

  const expectedPBxPosition = Math.floor(P_A.x) + newOverlayCanvasWidth
  const LIMIT_SCAN_X = expectedPBxPosition === Math.floor(P_B.x)
    ? Math.floor(P_B.x)
    : Math.floor(P_B.x + 1)

  const expectedPCyPosition = Math.floor(P_A.y) + newOverlayCanvasHeight
  const LIMIT_SCAN_Y = expectedPCyPosition === Math.floor(P_C.y)
    ? Math.floor(P_C.y)
    : Math.floor(P_C.y + 1)

  const clippedImageBytesMatrix = []

  for (let y = Math.floor(P_A.y); y < LIMIT_SCAN_Y; y++) {
    const rowOfPixels = []
    for (let x = Math.floor(P_A.x); x < LIMIT_SCAN_X; x++) {
      rowOfPixels.push(orderedImageBytes[y][x])
    }

    clippedImageBytesMatrix.push(rowOfPixels)
  }

  const clippedImageBytes = new Uint8Array(clippedImageBytesMatrix.flat(2))

  const canvasImageData = ctx.createImageData(newOverlayCanvasWidth, newOverlayCanvasHeight)

  try {
    canvasImageData.data.set(clippedImageBytes)
    ctx.putImageData(canvasImageData, 0, 0)
  } catch (error) {
    postMessage(Result.Failed({ error }))
    return
  }

  const imageData = ctx.getImageData(0, 0, newOverlayCanvasWidth, newOverlayCanvasHeight)

  postMessage(Result.Successful(new Uint8Array(imageData.data.buffer)))
}
