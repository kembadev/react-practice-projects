import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  UndoIcon,
  RedoIcon,
  RotateRightIcon,
  RotateLeftIcon,
  FolderIcon
} from './components/Icons.jsx'
import { EVENTS, ORIENTATION_TYPE } from './consts.js'
import { useImage } from './hooks/useImage.js'
import { useControls } from './hooks/useControls.js'
import { Result } from './utils.js'
import { getCanvasResize } from './methods/getCanvasResize.js'

function App () {
  const { image, setImage, errorMessage, setErrorMessage, handleSubmit } = useImage()
  const canvas = useRef()
  const [imgElement, setImgElement] = useState(null)
  const [ctx, setCtx] = useState(null)
  const {
    setCanvasInitialDimensions,
    invertImage,
    rotateToLeft,
    rotateToRight,
    setCanvasOrientation
  } = useControls({ canvas: canvas.current, ctx, imageFile: image, imgElement })
  const [canvasLogs, setCanvasLogs] = useState([])
  const [isOnDragOver, setIsOnDragOver] = useState(false)

  const handleUploadImage = (e) => {
    e.target.closest('form').requestSubmit()
  }

  useEffect(() => {
    const onLoadCanvas = async (e) => {
      const loadedImgElement = e.detail
      setImgElement(loadedImgElement)
      const { height: imgHeight, width: imgWidth } = loadedImgElement

      const canvasElement = canvas.current
      const context = canvasElement.getContext('2d', { willReadFrequently: true })
      setCtx(context)

      const { offsetHeight: parentHeight, offsetWidth: parentWidth } = canvasElement.parentElement

      // most optimal dimensions for the canvas
      const { finalCanvasHeight, finalCanvasWidth } = await getCanvasResize({
        imgHeight,
        imgWidth,
        parentHeight,
        parentWidth
      })

      canvasElement.height = finalCanvasHeight
      canvasElement.width = finalCanvasWidth

      setCanvasInitialDimensions({ height: finalCanvasHeight, width: finalCanvasWidth })

      const originalImgAverageScale = ((finalCanvasHeight / imgHeight) + (finalCanvasWidth / imgWidth)) / 2
      context.scale(originalImgAverageScale, originalImgAverageScale)

      context.drawImage(loadedImgElement, 0, 0)
    }

    window.addEventListener(EVENTS.IMAGE_LOAD, onLoadCanvas)

    return () => {
      window.removeEventListener(EVENTS.IMAGE_LOAD, onLoadCanvas)
    }
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()

    setIsOnDragOver(false)
    const items = e.dataTransfer.items
    if (items.length > 1) return setErrorMessage('No se admiten múltiples archivos.')

    const usableItem = items[0]
    let file

    if (usableItem.kind === 'string') {
      file = Result.Failed({ value: items[0], error: 'Los textos no están admitido.' })
    } else if (usableItem.type.split('/')[0] !== 'image') {
      file = Result.Failed({ error: `El archivo debe ser de tipo imagen. Recibido: ${usableItem.type}.` })
    }

    if (usableItem.type.split('/')[0] === 'image') {
      file = Result.Successful(usableItem.getAsFile())
    }

    if (file.success) {
      setImage(file.value)
      return
    }

    setErrorMessage(file.error)
  }

  const handleOnDragOver = (e) => {
    e.preventDefault()
    if (!isOnDragOver) setIsOnDragOver(true)
  }

  return (
    <>
      {image
        ? (
        <main>
          <div className="canvasContainer">
            <canvas ref={canvas} />
          </div>

          <div className='actionsContainer'>
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

            <div className='buttons'>
              <button className="saveBtn" title="Guardar imagen">
                Guardar
              </button>
              <button
              className='discardChangesBtn'
              title='Descartar imagen'
              onClick={() => {
                setImage(null)
                setErrorMessage(null)
                setImgElement(null)
                setCanvasInitialDimensions({ height: 0, width: 0 })
                setCanvasOrientation(ORIENTATION_TYPE.INITIAL)
                setCanvasLogs([])
              }}
              >
                Descartar
              </button>
            </div>
          </div>
        </main>
          )
        : (
          <header className='description'>
            <h1>Editor básico de imágenes</h1>
            <form
              className="form-imageInput"
              onSubmit={handleSubmit}
              onDrop={handleDrop}
              onDragOver={handleOnDragOver}
              onDragLeave={() => {
                setIsOnDragOver(false)
              }}
              style={{
                color: isOnDragOver && '#505756',
                transform: isOnDragOver && 'scale(1.1)',
                transition: 'all 200ms'
              }}
            >
              <div>
                <span><FolderIcon /></span>
                <strong>Arrastra la imagen aquí</strong>
                <label
                title="Click para seleccionar una imagen del explorador de archivos"
                >
                  o abrir explorador
                  <input
                    type="file"
                    name="imageFile"
                    accept='image/*'
                    hidden
                    onChange={handleUploadImage}
                  />
                </label>
              </div>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
          </header>
          )
      }
    </>
  )
}

export default App
