import { useContext } from 'react'
import { ImageBytesContext } from '../context/imageBytes'

export function useImageBytes () {
  const context = useContext(ImageBytesContext)

  if (context === undefined) {
    throw new Error('useImageBytes must be used within a ImageBytesProvider')
  }

  return context
}
