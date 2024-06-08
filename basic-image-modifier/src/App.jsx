import { useEffect, useRef } from 'react'
import './App.css'
import {
  ScaleIcon,
  UndoIcon,
  RedoIcon,
  RotateRightIcon,
  RotateLeftIcon
} from './components/Icons.jsx'
import { EVENTS } from './consts.js'
import { useImage } from './hooks/useImage.js'
import { useControls } from './hooks/useControls.js'

function App () {
  const { image, errorMessage, handleSubmit } = useImage()
  const canvas = useRef()
  const { scale, updateScale, setOriginalDimensions } = useControls(canvas.current)

  const handleUploadImage = (e) => {
    e.target.closest('form').requestSubmit()
  }

  useEffect(() => {
    const onLoadCanvas = (e) => {
      const imgElement = e.detail
      const { height, width } = imgElement

      setOriginalDimensions({ height, width })

      const canvasElement = canvas.current
      const ctx = canvasElement.getContext('2d')

      canvasElement.height = height
      canvasElement.width = width

      ctx.drawImage(imgElement, 0, 0)
    }

    window.addEventListener(EVENTS.IMAGE_LOAD, onLoadCanvas)

    return () => {
      window.removeEventListener(EVENTS.IMAGE_LOAD, onLoadCanvas)
    }
  }, [image])

  return (
    <>
      {image
        ? (
        <main>
          <div className="canvasContainer" style={{ position: 'relative' }}>
            <canvas ref={canvas} />
            <span style={{ position: 'absolute', bottom: 0, fontSize: '0.9em', fontWeight: 'lighter' }}>x{scale}</span>
          </div>
          <div className='actionContainer'>
          <section className="utilitiesContainer">
            <header className="mainControls">
              <article className="utility-rotate">
                <button title="Rotar a la izquierda">
                  <RotateLeftIcon />
                </button>
                <button title="Rotar a la derecha">
                  <RotateRightIcon />
                </button>
              </article>
              <article className="utility-scale" title="Escalar imagen">
                <span>
                  <ScaleIcon />
                </span>
                <input
                type="range"
                min="0.25"
                max="2.5"
                step="0.05"
                onChange={updateScale}
                value={scale}
                />
              </article>
              <article className="utility-invert">
                <button title="Invertir imagen">Invertir</button>
              </article>
            </header>
            <div className="restoreActions">
              <button title="Deshacer">
                <UndoIcon />
              </button>
              <button title="Rehacer">
                <RedoIcon />
              </button>
            </div>
          </section>
          <button className="saveBtn" title="Guardar imagen">
            Guardar
          </button>
          </div>
        </main>
          )
        : (
          <>
            <form className="form-imageInput" onSubmit={handleSubmit}>
              <label title="Click para seleccionar una imagen">
                Seleccionar imagen
                <input
                type="file"
                name="imageFile"
                hidden
                onChange={handleUploadImage}
                />
              </label>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
          </>
          )
      }
    </>
  )
}

export default App
