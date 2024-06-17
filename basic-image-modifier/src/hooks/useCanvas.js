import { useContext } from 'react'
import { CanvasContext } from '../context/canvas.jsx'

export function useCanvas () {
  const context = useContext(CanvasContext)

  if (context === undefined) {
    throw new Error('useCanvas must be within a CanvasProvider')
  }

  return context
}
