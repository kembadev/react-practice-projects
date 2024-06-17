import './ControlPanel.css'

import { RotateLeftIcon, RotateRightIcon, UndoIcon, RedoIcon } from './Icons.jsx'

import { useMemo } from 'react'
import { useControls } from '../hooks/useControls.js'

export function ControlPanel () {
  const { logs, invertImage, rotateToLeft, rotateToRight, handleUndo, handleRedo, clearCanvas } = useControls()

  const currentStateIndex = useMemo(() => logs.findIndex(
    ({ isCurrentState }) => Boolean(isCurrentState)
  ), [logs])

  return (
    <header className='actionsContainer'>
      <section className="utilitiesContainer">
        <article className="mainControls">
          <div className="utility-rotate">
            <button title="Rotar a la izquierda" onClick={rotateToLeft}>
              <RotateLeftIcon />
            </button>
            <button title="Rotar a la derecha" onClick={rotateToRight}>
              <RotateRightIcon />
            </button>
          </div>
          <div className="utility-invert">
            <button title="Invertir imagen" onClick={invertImage}>Invertir</button>
          </div>
        </article>

        <article className="restoreActions">
          <button
            title="Deshacer"
            onClick={handleUndo}
            style={{ backgroundColor: currentStateIndex === 0 && 'transparent' }}
          >
            <UndoIcon />
          </button>
          <button
            title="Rehacer"
            onClick={handleRedo}
            style={{ backgroundColor: currentStateIndex === logs.length - 1 && 'transparent' }}
          >
            <RedoIcon />
          </button>
        </article>
      </section>

      <section className='save-discard_container'>
        <button
          className="saveBtn"
          title="Guardar imagen"
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
    </header>
  )
}
