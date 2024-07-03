// import { EVENTS } from '../consts.js'

import { useState, /* useEffect,  */useContext } from 'react'
import { CanvasContext } from '../context/canvas.jsx'

export function useImageFile () {
  const context = useContext(CanvasContext)

  if (context === undefined) {
    throw new Error('useImageFile must be within a CanvasProvider')
  }

  const { userImageFile, setUserImageFile } = context

  const [errorMessage, setErrorMessage] = useState(null)

  return { setUserImageFile, userImageFile, errorMessage, setErrorMessage }
}
