import './UploadField.css'

import { FolderIcon } from './Icons.jsx'
import { useImageFile } from '../hooks/useImageFile.js'

import { useState } from 'react'
import { useCanvas } from '../hooks/useCanvas.js'

import { Result } from '../utils.js'

export function UploadField () {
  const { errorMessage, setErrorMessage } = useImageFile()
  const { setUserImageFile } = useCanvas()
  const [isOnDragOver, setIsOnDragOver] = useState(false)

  const handleUploadImage = (e) => {
    e.target.closest('form').requestSubmit()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { imageFile } = Object.fromEntries(new FormData(e.target))

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

    if (file.success) return setUserImageFile(file.value)

    setErrorMessage(file.error)
  }

  const handleOnDragOver = (e) => {
    e.preventDefault()

    if (!isOnDragOver) setIsOnDragOver(true)
  }

  return (
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
