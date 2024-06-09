export async function getImageBytesFromContext ({ ctx, canvasWidth, canvasHeight }) {
  const imageBytesData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  return new Uint8Array(imageBytesData.data.buffer)
}
