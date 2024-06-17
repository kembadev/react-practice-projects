import { DIRECTION, LOG_RESTORE, ORIENTATION_TYPE } from '../consts.js'

import { useImageBytes } from './useImageBytes.js'
import { useCanvas } from './useCanvas.js'
import { useLogs } from './useLogs.js'

import { getRotatedImageBytes } from '../methods/rotate.js'
import { getImageBytesXAxisInverted } from '../methods/invert.js'
import { getCurrentCanvasDimensions } from '../methods/getCanvasDimensions.js'

export function useControls () {
  const { resetCanvas, canvas, canvasInitialDimensions, canvasOrientation, setCanvasOrientation } = useCanvas()
  const { currentImageBytes, updateImageBytes, clearImageBytes } = useImageBytes()
  const { logs, clearLogs, toggleCurrentState } = useLogs()

  const clearCanvas = () => {
    clearImageBytes()
    resetCanvas()
    clearLogs()
  }

  const invertImage = () => {
    const { canvasHeight, canvasWidth } = getCurrentCanvasDimensions({ canvasOrientation, canvasInitialDimensions })

    getImageBytesXAxisInverted({ imageBytes: currentImageBytes, canvasHeight, canvasWidth })
      .then(invertedImageBytes => updateImageBytes(invertedImageBytes))
  }

  const doRotation = (direction) => {
    const { canvasHeight, canvasWidth } = getCurrentCanvasDimensions({ canvasOrientation, canvasInitialDimensions })

    getRotatedImageBytes({ imageBytes: currentImageBytes, canvasWidth, canvasHeight, direction })
      .then(rotatedImageBytes => {
        canvas.current.width = canvasHeight
        canvas.current.height = canvasWidth

        updateImageBytes(rotatedImageBytes)

        setCanvasOrientation(prevType => {
          return prevType === ORIENTATION_TYPE.INITIAL ? ORIENTATION_TYPE.TWISTED : ORIENTATION_TYPE.INITIAL
        })
      })
  }

  const rotateToLeft = () => {
    doRotation(DIRECTION.LEFT)
  }

  const rotateToRight = () => {
    doRotation(DIRECTION.RIGHT)
  }

  const handleLogRestore = (type) => {
    const isUndo = type === LOG_RESTORE.UNDO

    const newCurrentStateIndex = logs.findIndex(
      ({ isCurrentState }) => Boolean(isCurrentState)
    ) + (isUndo ? -1 : +1)

    if (newCurrentStateIndex === (isUndo ? -1 : logs.length)) return

    const desiredLog = logs[newCurrentStateIndex]

    toggleCurrentState(newCurrentStateIndex)
    updateImageBytes(desiredLog.imageBytes)
    setCanvasOrientation(desiredLog.orientation)
    canvas.current.width = desiredLog.canvasWidth
    canvas.current.height = desiredLog.canvasHeight
  }

  const handleUndo = () => {
    handleLogRestore(LOG_RESTORE.UNDO)
  }

  const handleRedo = () => {
    handleLogRestore(LOG_RESTORE.REDO)
  }

  return {
    logs,
    invertImage,
    rotateToLeft,
    rotateToRight,
    handleUndo,
    handleRedo,
    clearCanvas
  }
}
