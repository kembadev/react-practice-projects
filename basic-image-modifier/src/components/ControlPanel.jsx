import './ControlPanel.css'

import { UndoIcon, RedoIcon } from './Icons.jsx'
import { Crop } from './tools/Crop.jsx'

import { useMemo, useState } from 'react'
import { useControls } from '../hooks/useControls.js'

const tools = [
  {
    name: 'Crop',
    Component: Crop
  },
  {
    name: 'Effects',
    Component: () => <button>Sepia</button>
  },
  {
    name: 'MarkUp',
    Component: () => <button>Text</button>
  }
]

export function ControlPanel () {
  const [toolSelected, setToolSelected] = useState('Crop')
  const {
    logs,
    handleUndo,
    handleRedo,
    clearCanvas
  } = useControls()

  const currentStateIndex = useMemo(() => logs.findIndex(
    ({ isCurrentState }) => Boolean(isCurrentState)
  ), [logs])

  const ToolsComponent = useMemo(() => tools.find(
    ({ name }) => name === toolSelected
  ).Component, [toolSelected])

  return (
    <header className='actionsContainer'>
      <section className="utilitiesContainer">
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

        <article className="mainControls">
          <ToolsComponent />
        </article>
      </section>

      <section className='toolSelector'>
        <ul>
          {
            tools.map(({ name }) => (
              <li key={name}>
                <button
                  onClick={() => { setToolSelected(name) }}
                  style={{ backgroundColor: name !== toolSelected && 'transparent', borderRadius: '15px' }}
                >{name}</button>
              </li>
            ))
          }
        </ul>
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
