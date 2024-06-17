import { EVENTS } from '../consts.js'

import { useState, useEffect } from 'react'
import { useCanvas } from './useCanvas.js'

export function useImageFile () {
  const { userImageFile } = useCanvas()
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (!userImageFile) return

    const onLoadImage = () => {
      const imageLoadEvent = new CustomEvent(EVENTS.IMAGE_LOAD, { detail: imgElement })
      window.dispatchEvent(imageLoadEvent)
    }

    const blob = new Blob([userImageFile], { type: userImageFile.type })
    const url = URL.createObjectURL(blob)
    const imgElement = document.createElement('img')
    imgElement.src = url

    imgElement.addEventListener('load', onLoadImage)

    return () => {
      imgElement.removeEventListener('load', onLoadImage)
    }
  }, [userImageFile])

  return { errorMessage, setErrorMessage }
}
