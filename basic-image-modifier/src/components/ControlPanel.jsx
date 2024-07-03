import './ControlPanel.css'

import { tools } from './tools.jsx'

import { UndoIcon, RedoIcon } from './Icons.jsx'
import { ToolsList } from './ToolsList.jsx'
import DownloadModal from './DownloadModal.jsx'

import { useEffect, useMemo, useRef } from 'react'
import { useControls } from '../hooks/useControls.js'
import { useLogs } from '../hooks/useLogs.js'
import { useImageBytes } from '../hooks/useImageBytes.js'
import { useCanvas } from '../hooks/useCanvas.js'
import { useTools } from '../hooks/useTools.js'

export function ControlPanel () {
  const { toolSelected, setToolSelected } = useTools()
  const { logs, addLog, changeAfterUndo } = useLogs()
  const { currentImageBytes } = useImageBytes()
  const { canvas, scaling, canvasOrientation } = useCanvas()
  const {
    handleUndo,
    handleRedo,
    clearCanvas
  } = useControls()

  const modal = useRef()

  useEffect(() => {
    if (!currentImageBytes) return

    const { width: canvasWidth, height: canvasHeight } = canvas.current
    const orientation = canvasOrientation

    const newLog = {
      scaling,
      imageBytes: currentImageBytes,
      orientation,
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
        changeAfterUndo({ currentStateLogIndex, newLog })
      }

      return
    }

    if (currentStateLogIndex === logs.length - 1 && !isCurrentImageBytesDifferentOfTheUsedLog) return

    addLog(newLog)
  }, [currentImageBytes])

  const openModal = () => {
    modal.current.showModal()
  }

  const currentStateIndex = useMemo(() => logs.findIndex(
    ({ isCurrentState }) => Boolean(isCurrentState)
  ), [logs])

  const Tools = useMemo(() => tools.find(
    ({ name }) => name === toolSelected
  ).Component, [toolSelected])

  return (
    <header className='actionsContainer'>
      <section className="utilitiesContainer">
        <article className="restoreActions">
          <button
            title="Deshacer"
            onClick={handleUndo}
            style={{
              backgroundColor: currentStateIndex === 0 && 'transparent',
              cursor: currentStateIndex === 0 && 'auto'
            }}
          >
            <UndoIcon />
          </button>
          <button
            title="Rehacer"
            onClick={handleRedo}
            style={{
              backgroundColor: currentStateIndex === logs.length - 1 && 'transparent',
              cursor: currentStateIndex === logs.length - 1 && 'auto'
            }}
          >
            <RedoIcon />
          </button>
        </article>

        <article className="mainControls">
          <Tools />
        </article>
      </section>

      <section className='toolSelector'>
        <ToolsList setToolSelected={setToolSelected} toolSelected={toolSelected} tools={tools} />
      </section>

      <section className='save-discard_container'>
        <button
          className="saveBtn"
          title="Guardar imagen"
          onClick={openModal}
          aria-describedby='download-modal'
        >
          Guardar
        </button>
        <button
          className='discardChangesBtn'
          title='Descartar imagen'
          onClick={clearCanvas}
        >
          Descartar
        </button>
      </section>
      <DownloadModal ref={modal} />
    </header>
  )
}
