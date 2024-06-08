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
  const { setOriginalDimensions, invertImage } = useControls({ canvas: canvas.current, imageFile: image, imgElement })

  const handleUploadImage = (e) => {
    e.target.closest('form').requestSubmit()
  }

  useEffect(() => {
    const onLoadCanvas = (e) => {
      const imgElement = e.detail
      setImgElement(imgElement)
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
          <div className="canvasContainer">
            <canvas ref={canvas} />
          </div>

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
