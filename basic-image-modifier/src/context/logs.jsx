import { createContext } from 'react'
import { useLogsReducer } from '../hooks/useLogsReducer.js'

import PropTypes from 'prop-types'

export const LogsContext = createContext()

export function LogsProvider ({ children }) {
  const { state, clearLogs, toggleCurrentState, addLog, changeAfterUndo } = useLogsReducer()

  return (
    <LogsContext.Provider
      value={{
        logs: state,
        clearLogs,
        toggleCurrentState,
        addLog,
        changeAfterUndo
      }}
    >
      {children}
    </LogsContext.Provider>
  )
}

LogsProvider.propTypes = {
  children: PropTypes.node
}
