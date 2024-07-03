import { initialTool } from '../components/tools.jsx'

import { createContext, useState } from 'react'

import PropTypes from 'prop-types'

export const ToolsContext = createContext()

export function ToolsProvider ({ children }) {
  const [toolSelected, setToolSelected] = useState(initialTool)

  return (
    <ToolsContext.Provider
      value={{
        toolSelected,
        setToolSelected
      }}
    >
      {children}
    </ToolsContext.Provider>
  )
}

ToolsProvider.propTypes = {
  children: PropTypes.node
}
