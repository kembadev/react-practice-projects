import './UserView.css'

import { EVENTS } from '../consts.js'

import { LogsProvider } from '../context/logs.jsx'
import { ToolsProvider } from '../context/tools.jsx'

import { Canvas } from './Canvas.jsx'
import { UploadField } from './UploadField.jsx'
import { ControlPanel } from './ControlPanel.jsx'

import { useEffect } from 'react'
import { useImageBytes } from '../hooks/useImageBytes.js'
import { useCanvas } from '../hooks/useCanvas.js'

import { getImageScaling } from '../methods/getImageScaling.js'
import { getImageBytesFromContext } from '../methods/getImageBytes.js'

export function UserView () {
  const { updateImageBytes } = useImageBytes()
  const {
    canvas,
    canvasContainer,
    setCurrentCanvasDimensions,
    setCtx, userImgElement,
    setUserImgElement,
    setScaling
  } = useCanvas()

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
      const { offsetHeight: containerHeight, offsetWidth: containerWidth } = canvasContainer.current

      // most optimal dimensions for the canvas
      const { scaleY, scaleX } = await getImageScaling({
        originalHeight: imgHeight,
        originalWidth: imgWidth,
        containerHeight,
        containerWidth
      })

      const canvasWidth = Math.floor(imgWidth * scaleX)
      const canvasHeight = Math.floor(imgHeight * scaleY)

      canvas.current.height = canvasHeight
      canvas.current.width = canvasWidth
      setCurrentCanvasDimensions({ height: canvasHeight, width: canvasWidth })

      const context = canvas.current.getContext('2d', { willReadFrequently: true })
      setCtx(context)

      context.scale(scaleX, scaleY)
      setScaling({ x: scaleX, y: scaleY })

      context.drawImage(userImgElement, 0, 0)

      const imageBytes = await getImageBytesFromContext({
        ctx: context,
        canvasWidth,
        canvasHeight
      })

      updateImageBytes(imageBytes)
    })()
  }, [userImgElement])

  return (
    userImgElement
      ? (
          <main>
            <ToolsProvider>
              <Canvas />
              <LogsProvider>
                  <ControlPanel />
              </LogsProvider>
            </ToolsProvider>
          </main>
        )
      : (
          <UploadField />
        )
  )
}
