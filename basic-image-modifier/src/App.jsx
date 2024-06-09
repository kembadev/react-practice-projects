import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
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
  const [imgElement, setImgElement] = useState(null)
  const [ctx, setCtx] = useState(null)
  const {
    setOriginalDimensions,
    invertImage,
    rotateToLeft,
    rotateToRight
  } = useControls({ canvas: canvas.current, ctx, imageFile: image, imgElement })

  const handleUploadImage = (e) => {
    e.target.closest('form').requestSubmit()
  }

  useEffect(() => {
    const onLoadCanvas = (e) => {
      const loadedImgElement = e.detail
      setImgElement(loadedImgElement)
      const { height, width } = loadedImgElement

      setOriginalDimensions({ height, width })

      const canvasElement = canvas.current
      const context = canvasElement.getContext('2d', { willReadFrequently: true })
      setCtx(context)

      canvasElement.height = height
      canvasElement.width = width

      context.drawImage(loadedImgElement, 0, 0)
    }

    window.addEventListener(EVENTS.IMAGE_LOAD, onLoadCanvas)

    return () => {
      window.removeEventListener(EVENTS.IMAGE_LOAD, onLoadCanvas)
    }
  }, [setOriginalDimensions, imgElement])

  return (
    <>
      {image
        ? (
        <main>
          <div className="canvasContainer">
            <canvas ref={canvas} />
          </div>

          <section className="utilitiesContainer">
            <header className="mainControls">
              <article className="utility-rotate">
                <button title="Rotar a la izquierda" onClick={rotateToLeft}>
                  <RotateLeftIcon />
                </button>
                <button title="Rotar a la derecha" onClick={rotateToRight}>
                  <RotateRightIcon />
                </button>
              </article>
              <article className="utility-invert">
                <button title="Invertir imagen" onClick={invertImage}>Invertir</button>
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
