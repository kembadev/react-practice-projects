import { useEffect, useState } from 'react'
import { useImageBytes } from './useImageBytes.js'
import { useCanvas } from './useCanvas.js'

import { getCurrentCanvasDimensions } from '../methods/getCanvasDimensions.js'

export function useLogs () {
  const [logs, setLogs] = useState([])
  const { currentImageBytes } = useImageBytes()
  const { canvasOrientation, canvasInitialDimensions } = useCanvas()

  const clearLogs = () => {
    setLogs([])
  }

  const toggleCurrentState = (newCurrentStateIndex) => {
    setLogs(prevLogs => {
      const updatedLogs = [...prevLogs].map(log => ({ ...log, isCurrentState: false }))

      updatedLogs[newCurrentStateIndex].isCurrentState = true

      return updatedLogs
    })
  }

  useEffect(() => {
    if (!currentImageBytes) return

    const { canvasHeight, canvasWidth } = getCurrentCanvasDimensions({ canvasOrientation, canvasInitialDimensions })
    const newLog = {
      imageBytes: currentImageBytes,
      orientation: canvasOrientation,
      canvasWidth,
      canvasHeight,
      isCurrentState: true
    }

    const currentStateLogIndex = logs.findIndex(({ isCurrentState }) => Boolean(isCurrentState))
    const currentStateLog = logs[currentStateLogIndex]
    const isCurrentImageBytesDifferentOfTheUsedLog = !currentImageBytes.every(
      (value, index) => value === currentStateLog?.imageBytes[index]
    )

    if (currentStateLogIndex !== logs.length - 1) {
      if (isCurrentImageBytesDifferentOfTheUsedLog) {
        setLogs(prevLogs => {
          const updatedPrevLogs = [...prevLogs].slice(0, currentStateLogIndex + 1).map(
            log => ({ ...log, isCurrentState: false })
          )

          return [...updatedPrevLogs, newLog]
        })
      }

      return
    }

    if (currentStateLogIndex === logs.length - 1 && !isCurrentImageBytesDifferentOfTheUsedLog) return

    setLogs(prevLogs => {
      const updatedPrevLogs = [...prevLogs].map(log => ({ ...log, isCurrentState: false }))

      return [...updatedPrevLogs, newLog]
    })
  }, [currentImageBytes])

  return { logs, clearLogs, toggleCurrentState }
}
