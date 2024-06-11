import { useState, useEffect, useCallback } from 'react'
import { Result } from '../utils.js'
import { EVENTS } from '../consts.js'

export function useImage () {
  const [image, setImage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const { imageFile } = Object.fromEntries(new FormData(e.target))

    if (imageFile.length > 1) return setErrorMessage('No se admiten múltiples archivos.')

    const fileType = imageFile?.type.split('/')[0]
    let file

    if (fileType === undefined) {
      file = Result.Failed({ error: 'Archivo no encontrado.' })
    } else if (fileType !== 'image') {
      file = Result.Failed({ value: imageFile, error: `El archivo debe ser de tipo imagen. Recibido: ${imageFile.type}.` })
    }

    if (fileType === 'image') {
      file = Result.Successful(imageFile)
    }

    if (file.success) {
      setImage(file.value)
      return
    }

    setErrorMessage(file.error)
  }, [])

  useEffect(() => {
    if (!image) return

    const onLoadImage = () => {
      const imageLoadEvent = new CustomEvent(EVENTS.IMAGE_LOAD, { detail: imgElement })
      window.dispatchEvent(imageLoadEvent)
    }

    const blob = new Blob([image], { type: image.type })
    const url = URL.createObjectURL(blob)
    const imgElement = document.createElement('img')
    imgElement.src = url

    imgElement.addEventListener('load', onLoadImage)

    return () => {
      imgElement.removeEventListener('load', onLoadImage)
    }
  }, [image])

  return { image, setImage, errorMessage, setErrorMessage, handleSubmit }
}
