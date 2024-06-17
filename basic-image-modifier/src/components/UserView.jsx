import './UserView.css'

import { Canvas } from './Canvas.jsx'
import { UploadField } from './UploadField.jsx'
import { ControlPanel } from './ControlPanel.jsx'

import { EVENTS } from '../consts.js'

import { useEffect } from 'react'
import { useImageBytes } from '../hooks/useImageBytes.js'
import { useCanvas } from '../hooks/useCanvas.js'

import { getCanvasResize } from '../methods/getCanvasResize.js'
import { getImageBytesFromContext } from '../methods/imageBytes.js'

export function UserView () {
  const { updateImageBytes } = useImageBytes()
  const { canvas, setCtx, userImgElement, setUserImgElement, setCanvasInitialDimensions, setScaling } = useCanvas()

  useEffect(() => {
    const onLoadCanvas = (e) => {
      const loadedImgElement = e.detail
      setUserImgElement(loadedImgElement)
    }

    window.addEventListener(EVENTS.IMAGE_LOAD, onLoadCanvas)

    return () => {
      window.removeEventListener(EVENTS.IMAGE_LOAD, onLoadCanvas)
    }
  }, [])

  useEffect(() => {
    if (!userImgElement) return

    ;(async () => {
      const { height: imgHeight, width: imgWidth } = userImgElement

      const context = canvas.current.getContext('2d', { willReadFrequently: true })
      setCtx(context)

      const { offsetHeight: parentHeight, offsetWidth: parentWidth } = canvas.current.parentElement

      // most optimal dimensions for the canvas
      const { finalCanvasHeight, finalCanvasWidth } = await getCanvasResize({
        imgHeight,
        imgWidth,
        parentHeight,
        parentWidth
      })

      canvas.current.height = finalCanvasHeight
      canvas.current.width = finalCanvasWidth

      setCanvasInitialDimensions({ initialHeight: finalCanvasHeight, initialWidth: finalCanvasWidth })

      const averageImageScaling = ((finalCanvasHeight / imgHeight) + (finalCanvasWidth / imgWidth)) / 2
      context.scale(averageImageScaling, averageImageScaling)
      setScaling(averageImageScaling)

      context.drawImage(userImgElement, 0, 0)

      const imageBytes = await getImageBytesFromContext({
        ctx: context,
        canvasWidth: finalCanvasWidth,
        canvasHeight: finalCanvasHeight
      })

      updateImageBytes(imageBytes)
    })()
  }, [userImgElement])

  return (
    userImgElement
      ? (
          <main>
            <Canvas />
            <ControlPanel />
          </main>
        )
      : (
          <UploadField />
        )
  )
}
