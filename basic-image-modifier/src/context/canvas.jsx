import { ORIENTATION_TYPE } from '../consts.js'

import { createContext, useRef, useState } from 'react'

import PropTypes from 'prop-types'

export const CanvasContext = createContext()

export function CanvasProvider ({ children }) {
  const [userImageFile, setUserImageFile] = useState(null)
  const [userImgElement, setUserImgElement] = useState(null)

  const [currentCanvasDimensions, setCurrentCanvasDimensions] = useState({ width: 0, height: 0 })
  const [scaling, setScaling] = useState({ x: 1, y: 1 })
  const [canvasOrientation, setCanvasOrientation] = useState(ORIENTATION_TYPE.INITIAL)

  const [ctx, setCtx] = useState(null)

  const canvas = useRef()
  const canvasContainer = useRef()

  const resetCanvas = () => {
    setUserImageFile(null)
    setUserImgElement(null)
    setCurrentCanvasDimensions({ width: 0, height: 0 })
    setCanvasOrientation(ORIENTATION_TYPE.INITIAL)
    setScaling({ x: 1, y: 1 })
    setCtx(null)
  }

  return (
    <CanvasContext.Provider
      value={{
        resetCanvas,
        canvas,
        canvasContainer,
        ctx,
        setCtx,
        scaling,
        setScaling,
        userImageFile,
        setUserImageFile,
        userImgElement,
        setUserImgElement,
        canvasOrientation,
        setCanvasOrientation,
        currentCanvasDimensions,
        setCurrentCanvasDimensions
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}
CanvasProvider.propTypes = {
  children: PropTypes.node
}
