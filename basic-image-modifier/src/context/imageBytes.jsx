import { createContext } from 'react'
import { useImageBytesReducer } from '../hooks/useImageBytesReducer.js'

import PropTypes from 'prop-types'

export const ImageBytesContext = createContext()

export function ImageBytesProvider ({ children }) {
  const { state, updateImageBytes, clearImageBytes } = useImageBytesReducer()

  return (
    <ImageBytesContext.Provider
      value={{
        currentImageBytes: state,
        updateImageBytes,
        clearImageBytes
      }}
    >
      {children}
    </ImageBytesContext.Provider>
  )
}

ImageBytesProvider.propTypes = {
  children: PropTypes.node
}
