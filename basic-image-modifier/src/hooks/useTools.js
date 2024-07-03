import { useContext } from 'react'
import { ToolsContext } from '../context/tools.jsx'

export function useTools () {
  const context = useContext(ToolsContext)

  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider')
  }

  return context
}
