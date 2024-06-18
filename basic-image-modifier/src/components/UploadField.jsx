import './UploadField.css'

import { FolderIcon } from './Icons.jsx'
import { useImageFile } from '../hooks/useImageFile.js'

import { useRef, useState } from 'react'
import { useCanvas } from '../hooks/useCanvas.js'

import { Result } from '../utils.js'

export function UploadField () {
  const { errorMessage, setErrorMessage } = useImageFile()
  const { setUserImageFile } = useCanvas()
  const [isOnDragOver, setIsOnDragOver] = useState(false)
  const form = useRef()

  const handleUploadImage = () => {
    form.current.requestSubmit()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { imageFile } = Object.fromEntries(new FormData(e.target))

    if (imageFile === undefined) return setErrorMessage('Ocurrió algo inesperado. Inténtalo de nuevo.')

    if (imageFile.length > 1) return setErrorMessage('No se admiten múltiples archivos.')

    const fileType = imageFile?.type.split('/')[0]
    let file

    if (fileType === undefined) {
      file = Result.Failed({ error: 'Archivo no encontrado.' })
    } else if (fileType !== 'image') {
      file = Result.Failed({
        value: imageFile,
        error: `El archivo debe ser de tipo imagen. Recibido: ${imageFile.type}.`
      })
    }

    if (fileType === 'image') {
      file = Result.Successful(imageFile)
    }

    if (file.success) return setUserImageFile(file.value)

    setErrorMessage(file.error)
  }

  const handleDrop = (e) => {
    e.preventDefault()

    setIsOnDragOver(false)

    const items = e.dataTransfer.items

    const usableItem = items[0]

    if (usableItem.kind !== 'file') return setErrorMessage('Sólo se admiten archivos.')

    const input = form.current.querySelector('input[name="imageFile"]')

    if (!input) return setErrorMessage('Ocurrió algo inesperado. Inténtalo de nuevo.')

    const file = usableItem.getAsFile()

    const fileList = new DataTransfer()
    fileList.items.add(file)

    input.files = fileList.files

    form.current.requestSubmit()
  }

  const handleOnDragOver = (e) => {
    e.preventDefault()

    if (!isOnDragOver) setIsOnDragOver(true)
  }

  return (
    <header className='uploadContainer'>
      <h1>Editor básico de imágenes</h1>
      <form
        className="form-imageInput"
        ref={form}
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        onDragOver={handleOnDragOver}
        onDragLeave={() => {
          setIsOnDragOver(false)
        }}
        style={{
          color: isOnDragOver && '#505756',
          transform: isOnDragOver && 'scale(1.1)',
          transition: isOnDragOver && 'all 200ms'
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
