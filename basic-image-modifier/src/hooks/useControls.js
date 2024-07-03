import { DIRECTION, LOG_RESTORE, ORIENTATION_TYPE } from '../consts.js'

import { useImageBytes } from './useImageBytes.js'
import { useCanvas } from './useCanvas.js'
import { useLogs } from './useLogs.js'

import { getRotatedImageBytes } from '../methods/rotate.js'
import { getImageBytesXAxisInverted } from '../methods/invert.js'

export function useControls () {
  const {
    canvas,
    currentCanvasDimensions,
    setCurrentCanvasDimensions,
    setCanvasOrientation,
    setScaling,
    resetCanvas
  } = useCanvas()
  const { currentImageBytes, updateImageBytes, clearImageBytes } = useImageBytes()
  const { logs, clearLogs, toggleCurrentState } = useLogs()

  const handleLogRestore = (type) => {
    const isUndo = type === LOG_RESTORE.UNDO

    const newCurrentStateIndex = logs.findIndex(
      ({ isCurrentState }) => Boolean(isCurrentState)
    ) + (isUndo ? -1 : +1)

    if (newCurrentStateIndex === (isUndo ? -1 : logs.length)) return

    const desiredLog = logs[newCurrentStateIndex]

    const { imageBytes, canvasWidth, canvasHeight, orientation, scaling } = desiredLog

    toggleCurrentState(newCurrentStateIndex)
    updateImageBytes(imageBytes)
    setCurrentCanvasDimensions({ width: canvasWidth, height: canvasHeight })
    setCanvasOrientation(orientation)
    setScaling(scaling)
  }

  const handleUndo = () => {
    handleLogRestore(LOG_RESTORE.UNDO)
  }

  const handleRedo = () => {
    handleLogRestore(LOG_RESTORE.REDO)
  }

  const clearCanvas = () => {
    clearImageBytes()
    resetCanvas()
    clearLogs()
  }

  const invertImage = () => {
    getImageBytesXAxisInverted({ imageBytes: currentImageBytes, canvasWidth: canvas.current.width })
      .then(updateImageBytes)
  }

  const doRotation = async (direction) => {
    const { width: canvasWidth, height: canvasHeight } = currentCanvasDimensions

    let rotatedImageBytes

    try {
      rotatedImageBytes = await getRotatedImageBytes({ imageBytes: currentImageBytes, canvasWidth, canvasHeight, direction })
    } catch (err) {
      console.error(err)
      return
    }

    // canvas.current.width = canvasHeight
    // canvas.current.height = canvasWidth

    updateImageBytes(rotatedImageBytes)

    setCurrentCanvasDimensions({ width: canvasHeight, height: canvasWidth })

    setCanvasOrientation(
      prevOrientation => prevOrientation === ORIENTATION_TYPE.INITIAL
        ? ORIENTATION_TYPE.TWISTED
        : ORIENTATION_TYPE.INITIAL
    )
  }

  const rotateToLeft = () => {
    doRotation(DIRECTION.LEFT)
  }

  const rotateToRight = () => {
    doRotation(DIRECTION.RIGHT)
  }

  return {
    invertImage,
    rotateToLeft,
    rotateToRight,
    handleUndo,
    handleRedo,
    clearCanvas
  }
}
