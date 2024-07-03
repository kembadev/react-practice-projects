import { useReducer } from 'react'

import { initialLogs, LOGS_ACTION_TYPES, logs } from '../reducers/logs.js'

export function useLogsReducer () {
  const [state, dispatch] = useReducer(logs, initialLogs)

  const clearLogs = () => dispatch({
    type: LOGS_ACTION_TYPES.CLEAR
  })

  const toggleCurrentState = newCurrentStateIndex => dispatch({
    type: LOGS_ACTION_TYPES.TOGGLE_CURRENT_STATE,
    payload: newCurrentStateIndex
  })

  const changeAfterUndo = ({ currentStateLogIndex, newLog }) => dispatch({
    type: LOGS_ACTION_TYPES.CHANGE_AFTER_UNDO,
    payload: { currentStateLogIndex, newLog }
  })

  const addLog = newLog => dispatch({
    type: LOGS_ACTION_TYPES.ADD_LOG,
    payload: newLog
  })

  return { state, clearLogs, toggleCurrentState, addLog, changeAfterUndo }
}
