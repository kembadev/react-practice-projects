export async function getImageBytesFromContext ({ ctx, width, height }) {
  const imageBytesData = ctx.getImageData(0, 0, width, height)
  return new Uint8Array(imageBytesData.data.buffer)
}
