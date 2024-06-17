import { useReducer } from 'react'
import { imageBytes, initialImageBytes, IMAGE_BYTES_ACTION_TYPES } from '../reducers/imageBytes.js'

export function useImageBytesReducer () {
  const [state, dispatch] = useReducer(imageBytes, initialImageBytes)

  const updateImageBytes = newImageBytes => dispatch({
    type: IMAGE_BYTES_ACTION_TYPES.UPDATE,
    payload: newImageBytes
  })

  const clearImageBytes = () => dispatch({
    type: IMAGE_BYTES_ACTION_TYPES.CLEAR
  })

  return { state, updateImageBytes, clearImageBytes }
}
