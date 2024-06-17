import { createContext, useRef, useState } from 'react'
import { ORIENTATION_TYPE } from '../consts.js'

export const CanvasContext = createContext()

export function CanvasProvider ({ children }) {
  const [userImageFile, setUserImageFile] = useState(null)
  const [userImgElement, setUserImgElement] = useState(null)
  const [canvasInitialDimensions, setCanvasInitialDimensions] = useState({ initialHeight: 0, initialWidth: 0 })
  const [canvasOrientation, setCanvasOrientation] = useState(ORIENTATION_TYPE.INITIAL)
  const [scaling, setScaling] = useState(1)
  const [ctx, setCtx] = useState(null)
  const canvas = useRef()

  const resetCanvas = () => {
    setUserImageFile(null)
    setUserImgElement(null)
    setCanvasInitialDimensions({ initialHeight: 0, initialWidth: 0 })
    setCanvasOrientation(ORIENTATION_TYPE.INITIAL)
    setScaling(1)
    setCtx(null)
  }

  return (
    <CanvasContext.Provider
      value={{
        resetCanvas,
        canvas,
        ctx,
        setCtx,
        userImageFile,
        setUserImageFile,
        userImgElement,
        setUserImgElement,
        canvasInitialDimensions,
        setCanvasInitialDimensions,
        canvasOrientation,
        setCanvasOrientation,
        scaling,
        setScaling
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}
