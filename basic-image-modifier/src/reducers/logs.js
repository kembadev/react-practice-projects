export const initialLogs = []

export const LOGS_ACTION_TYPES = {
  CLEAR: 'CLEAR',
  TOGGLE_CURRENT_STATE: 'TOGGLE_CURRENT_STATE',
  CHANGE_AFTER_UNDO: 'CHANGE_AFTER_UNDO',
  ADD_LOG: 'ADD_LOG'
}

const UPDATE_BY_ACTION_TYPE = {
  [LOGS_ACTION_TYPES.CLEAR]: () => initialLogs,
  [LOGS_ACTION_TYPES.TOGGLE_CURRENT_STATE]: (state, action) => {
    const { payload: newCurrentStateIndex } = action
    const updatedLogs = [...state].map(log => ({ ...log, isCurrentState: false }))

    updatedLogs[newCurrentStateIndex].isCurrentState = true

    return updatedLogs
  },
  [LOGS_ACTION_TYPES.CHANGE_AFTER_UNDO]: (state, action) => {
    const { payload } = action
    const { currentStateLogIndex, newLog } = payload

    const updatedPrevLogs = [...state].slice(0, currentStateLogIndex + 1).map(
      log => ({ ...log, isCurrentState: false })
    )

    return [...updatedPrevLogs, newLog]
  },
  [LOGS_ACTION_TYPES.ADD_LOG]: (state, action) => {
    const { payload } = action
    const updatedPrevLogs = [...state].map(log => ({ ...log, isCurrentState: false }))

    return [...updatedPrevLogs, payload]
  }
}

export const logs = (state, action) => {
  const { type } = action

  const updateState = UPDATE_BY_ACTION_TYPE?.[type]

  return updateState ? updateState(state, action) : state
}
