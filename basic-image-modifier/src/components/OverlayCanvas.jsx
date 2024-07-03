import './OverlayCanvas.css'

import { ORIENTATION_TYPE, CORNER_POSITION } from '../consts.js'

import { CheckIcon } from './Icons.jsx'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useCanvas } from '../hooks/useCanvas.js'
import { useImageBytes } from '../hooks/useImageBytes.js'
import { useImageFile } from '../hooks/useImageFile.js'

import { getValidatedCoord } from '../methods/getValidatedCoord.js'
import { getImageScaling } from '../methods/getImageScaling.js'
import { getImageBytesFromContext } from '../methods/getImageBytes.js'

const cornersDisposition = [
  { x: CORNER_POSITION.LEFT, y: CORNER_POSITION.TOP },
  { x: CORNER_POSITION.RIGHT, y: CORNER_POSITION.TOP },
  { x: CORNER_POSITION.LEFT, y: CORNER_POSITION.BOTTOM },
  { x: CORNER_POSITION.RIGHT, y: CORNER_POSITION.BOTTOM }
]

export function OverlayCanvas () {
  const {
    canvas,
    canvasContainer,
    currentCanvasDimensions,
    setCurrentCanvasDimensions,
    scaling,
    setScaling,
    canvasOrientation
  } = useCanvas()

  const [fieldSizeThreshold, setFieldSizeThreshold] = useState(currentCanvasDimensions)
  const [fieldThresholdCoords, setFieldThresholdCoords] = useState({
    P_A: { x: 0, y: 0 }, // P_A    P_B //
    P_B: { x: 0, y: 0 }, //            //
    P_C: { x: 0, y: 0 }, //            //
    P_D: { x: 0, y: 0 } //  P_C   P_C //
  })

  const [isPointerDownToCrop, setIsPointerDownToCrop] = useState(false)
  const [isPointerDownToMove, setIsPointerDownToMove] = useState(false)
  const [currentPointerCoords, setCurrentPointerCoords] = useState({ x: 0, y: 0 })

  const [isOverlayCanvasChanging, setIsOverlayCanvasChanging] = useState(false)

  const { currentImageBytes, updateImageBytes } = useImageBytes()
  const { userImageFile } = useImageFile()

  const overlayCanvas = useRef()
  const isThereCropAction = useRef(false)

  useEffect(() => {
    if (!currentCanvasDimensions.width || !currentCanvasDimensions.height || canvas.current === undefined) return

    setFieldSizeThreshold(currentCanvasDimensions)

    setFieldThresholdCoords(prevCoords => {
      const updatedCoords = {}
      const keys = Object.keys(prevCoords)

      cornersDisposition.forEach(({ x, y }, index) => {
        const key = keys[index]

        updatedCoords[key] = {
          x: (x === CORNER_POSITION.LEFT ? 0 : 1) * currentCanvasDimensions.width,
          y: (y === CORNER_POSITION.TOP ? 0 : 1) * currentCanvasDimensions.height
        }
      })

      return updatedCoords
    })
  }, [currentCanvasDimensions, canvas])

  useEffect(() => {
    const { P_A, P_B, P_C } = fieldThresholdCoords

    if (Object.values(fieldThresholdCoords).every(({ x, y }) => x === 0 && y === 0)) return

    setFieldSizeThreshold({ width: P_B.x - P_A.x, height: P_C.y - P_A.y })
  }, [fieldThresholdCoords])

  useEffect(() => {
    if (isThereCropAction.current) {
      isThereCropAction.current = false
      return
    }

    const { width: canvasWidth, height: canvasHeight } = currentCanvasDimensions
    const { width: thresholdWith, height: thresholdHeight } = fieldSizeThreshold
    const { offsetWidth: parentWidth, offsetHeight: parentHeight } = canvasContainer.current

    if (!currentImageBytes ||
      !canvasWidth ||
      !canvasHeight ||
      !thresholdWith ||
      !thresholdHeight ||
      !parentWidth ||
      !parentHeight) return

    setIsOverlayCanvasChanging(true)

    const { offsetWidth: newOverlayCanvasWidth, offsetHeight: newOverlayCanvasHeight } = overlayCanvas.current.parentElement

    overlayCanvas.current.width = newOverlayCanvasWidth
    overlayCanvas.current.height = newOverlayCanvasHeight

    const ctx = overlayCanvas.current.getContext('2d', { willReadFrequently: true })

    if (canvasOrientation === ORIENTATION_TYPE.INITIAL) {
      ctx.scale(scaling.x, scaling.y)
    } else {
      ctx.scale(scaling.y, scaling.x)
    }

    const worker = new Worker('../../workers/overlay_canvas.js', { type: 'module' })

    worker.postMessage({
      currentImageBytes,
      canvasWidth,
      fieldThresholdCoords,
      newOverlayCanvasWidth,
      newOverlayCanvasHeight
    })

    worker.onmessage = e => {
      const canvasImageData = ctx.createImageData(newOverlayCanvasWidth, newOverlayCanvasHeight)

      const { value: imageBytes, success } = e.data

      try {
        if (!success) {
          throw new Error(e.data.error)
        }

        canvasImageData.data.set(imageBytes)
        ctx.putImageData(canvasImageData, 0, 0)
      } catch (err) {
        console.error(err)
      } finally {
        setIsOverlayCanvasChanging(false)
      }
    }

    return () => {
      worker.terminate()
    }
  }, [currentImageBytes, scaling, fieldThresholdCoords, fieldSizeThreshold])

  // crop image

  const getPointerCoordsOnCanvas = event => {
    const { offsetHeight: containerHeight, offsetWidth: containerWidth } = canvasContainer.current
    const { height: canvasHeight, width: canvasWidth } = currentCanvasDimensions

    const padding = 25

    const { pageY, pageX, touches } = event

    const desiredY = (pageY ?? touches[0].pageY) - padding - (containerHeight - canvasHeight) / 2
    const desiredX = (pageX ?? touches[0].pageX) - padding - (containerWidth - canvasWidth) / 2

    const usableY = getValidatedCoord({ desiredCoord: desiredY, heightLimit: canvasHeight })
    const usableX = getValidatedCoord({ desiredCoord: desiredX, widthLimit: canvasWidth })

    return { x: usableX, y: usableY }
  }

  const handleCropOnPointerDown = () => {
    setIsPointerDownToCrop(true)
  }

  const handleCropOnPointerUp = () => {
    setIsPointerDownToCrop(false)
  }

  const handleCropOnPointerLeave = () => {
    if (isPointerDownToCrop) setIsPointerDownToCrop(false)
  }

  const handleCropOnPointerMove = ({ event, dispositionX, dispositionY, index: currentManipulatingIndex }) => {
    if (!isPointerDownToCrop) return

    const newCoordsOfManipulatingCorner = getPointerCoordsOnCanvas(event)

    const cornersKeys = Object.keys(fieldThresholdCoords)

    const cornersKeysDisposition = {}
    cornersDisposition.forEach(({ x, y }, index) => {
      cornersKeysDisposition[cornersKeys[index]] = { x, y }
    })

    const currentManipulatingCorner = cornersKeys[currentManipulatingIndex]

    const fixedCornerIndex = cornersKeys.findIndex(
      key => (cornersKeysDisposition[key].x !== dispositionX &&
        cornersKeysDisposition[key].y !== dispositionY)
    )
    const fixedCorner = cornersKeys[fixedCornerIndex]

    setFieldThresholdCoords(prevCoords => {
      const updatedCoords = { ...prevCoords }
      updatedCoords[currentManipulatingCorner] = newCoordsOfManipulatingCorner
      updatedCoords[fixedCorner] = { ...prevCoords[fixedCorner] }

      for (let i = 0; i < 4; i++) {
        if (i === currentManipulatingIndex || i === fixedCornerIndex) continue

        const WORKING_KEY = cornersKeys[i]
        const { [WORKING_KEY]: WORKING_COORDS } = { ...prevCoords }

        updatedCoords[WORKING_KEY] = {
          x: dispositionX === cornersKeysDisposition[WORKING_KEY].x
            ? newCoordsOfManipulatingCorner.x
            : WORKING_COORDS.x,
          y: dispositionY === cornersKeysDisposition[WORKING_KEY].y
            ? newCoordsOfManipulatingCorner.y
            : WORKING_COORDS.y
        }
      }

      if (updatedCoords.P_B.x - updatedCoords.P_A.x <= 35 ||
        updatedCoords.P_C.y - updatedCoords.P_A.y <= 35) return prevCoords

      return updatedCoords
    })
  }

  // move image

  const handleMoveOnPointerDown = event => {
    setIsPointerDownToMove(true)
    setCurrentPointerCoords(getPointerCoordsOnCanvas(event))
  }

  const handleMoveOnPointerUp = () => {
    setIsPointerDownToMove(false)
    setCurrentPointerCoords({ x: 0, y: 0 })
  }

  const handleMoveOnPointerLeave = () => {
    if (isPointerDownToMove) {
      setIsPointerDownToMove(false)
      setCurrentPointerCoords({ x: 0, y: 0 })
    }
  }

  const handleMoveOnPointerShift = event => {
    if (!isPointerDownToMove) return

    const newCoordsOfPointer = getPointerCoordsOnCanvas(event)

    const deltaX = newCoordsOfPointer.x - currentPointerCoords.x
    const deltaY = newCoordsOfPointer.y - currentPointerCoords.y

    setCurrentPointerCoords(newCoordsOfPointer)

    setFieldThresholdCoords(prevCoords => {
      const updatedCoords = { ...prevCoords }
      const cornersKeys = Object.keys(prevCoords)

      cornersKeys.forEach(key => {
        const WORKING_COORDS = prevCoords[key]

        updatedCoords[key] = {
          x: WORKING_COORDS.x + deltaX,
          y: WORKING_COORDS.y + deltaY
        }
      })

      const { P_A, P_B, P_C } = updatedCoords
      const { height: canvasHeight, width: canvasWidth } = currentCanvasDimensions

      if (P_A.x < 0 || P_A.y < 0 ||
        P_B.x > canvasWidth ||
        P_C.y > canvasHeight) return prevCoords

      return updatedCoords
    })
  }

  const doCrop = async () => {
    const { height: overlayHeight, width: overlayWidth } = fieldSizeThreshold // phase 1.5
    const { offsetHeight: containerHeight, offsetWidth: containerWidth } = canvasContainer.current

    const { scaleX, scaleY } = await getImageScaling({
      originalHeight: overlayHeight,
      originalWidth: overlayWidth,
      containerHeight,
      containerWidth
    })

    const newCanvasHeight = Math.floor(overlayHeight * scaleY)
    const newCanvasWidth = Math.floor(overlayWidth * scaleX)

    // not needed, just for performance purposes
    isThereCropAction.current = true

    const canvasMock = new OffscreenCanvas(newCanvasWidth, newCanvasHeight)
    const ctxMock = canvasMock.getContext('2d')

    const onLoadImage = async () => {
      ctxMock.drawImage(scalingImage, 0, 0, newCanvasWidth, newCanvasHeight)

      const mockScalingImageData = await getImageBytesFromContext({
        ctx: ctxMock,
        canvasWidth: newCanvasWidth,
        canvasHeight: newCanvasHeight
      })

      setScaling(prevScale => {
        const { x, y } = prevScale
        return { x: x * scaleX, y: y * scaleY }
      })
      setCurrentCanvasDimensions({ height: newCanvasHeight, width: newCanvasWidth })
      updateImageBytes(mockScalingImageData)

      scalingImage.removeEventListener('load', onLoadImage)
      scalingImage.remove()
    }

    const scalingImage = document.createElement('img')
    scalingImage.src = overlayCanvas.current.toDataURL(userImageFile.type, 1)

    scalingImage.addEventListener('load', onLoadImage)
  }

  const isCropBtnVisible = useMemo(
    () => (fieldSizeThreshold.width !== currentCanvasDimensions.width ||
    fieldSizeThreshold.height !== currentCanvasDimensions.height),
    [fieldSizeThreshold, currentCanvasDimensions]
  )

  return (
    <>
      {
        (isCropBtnVisible && !isOverlayCanvasChanging) &&
          <button
            className='cropBtn'
            style={{
              bottom: `calc(50% - ${currentCanvasDimensions.height / 2}px - 30px)`,
              left: `calc(50% + ${currentCanvasDimensions.width / 2}px - 30px)`
            }}
            onClick={doCrop}
          >
            <CheckIcon />
          </button>
      }
      <div
        className='gridContainer'
        style={{
          width: fieldSizeThreshold.width,
          height: fieldSizeThreshold.height,
          top: `calc(50% - ${currentCanvasDimensions.height / 2}px + ${fieldThresholdCoords.P_A.y}px)`,
          left: `calc(50% - ${currentCanvasDimensions.width / 2}px + ${fieldThresholdCoords.P_C.x}px)`
        }}
      >
        {
          cornersDisposition.map(({ x, y }, index) => (
            <div
              className='corner'
              key={index}
              style={{
                '--cornerCircleSize': '16px',
                top: (y === CORNER_POSITION.TOP ? 0 : 1) * fieldSizeThreshold.height - 8 + 'px',
                left: (x === CORNER_POSITION.LEFT ? 0 : 1) * fieldSizeThreshold.width - 8 + 'px'
              }}

              onMouseDown={handleCropOnPointerDown}
              onMouseMove={(event) => {
                handleCropOnPointerMove({ event, dispositionX: x, dispositionY: y, index })
              }}
              onMouseUp={handleCropOnPointerUp}
              onMouseLeave={handleCropOnPointerLeave}

              onTouchStart={handleCropOnPointerDown}
              onTouchMove={(event) => {
                handleCropOnPointerMove({ event, dispositionX: x, dispositionY: y, index })
              }}
              onTouchEnd={handleCropOnPointerUp}
            />
          ))
        }
        <div
          className='grid'
          style={{
            '--spacingPatternToRight': (fieldSizeThreshold.width - 5) / 4 + 1 + 'px',
            '--spacingPatternToBottom': (fieldSizeThreshold.height - 5) / 4 + 1 + 'px'
          }}

          onMouseDown={handleMoveOnPointerDown}
          onMouseMove={handleMoveOnPointerShift}
          onMouseUp={handleMoveOnPointerUp}
          onMouseLeave={handleMoveOnPointerLeave}

          onTouchStart={handleMoveOnPointerDown}
          onTouchMove={handleMoveOnPointerShift}
          onTouchEnd={handleMoveOnPointerUp}
        />
        <canvas
          ref={overlayCanvas}
          className='overlayCanvas'
        />
      </div>
      <div
        className='darkArea'
        style={{
          width: currentCanvasDimensions.width,
          height: currentCanvasDimensions.height,
          opacity: isOverlayCanvasChanging ? 0 : 0.75
        }}
      />
    </>
  )
}
