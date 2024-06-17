export const initialImageBytes = null

export const IMAGE_BYTES_ACTION_TYPES = {
  UPDATE: 'UPDATE_IMAGE_BYTES',
  CLEAR: 'CLEAR_IMAGE_BYTES'
}

const UPDATE_BY_ACTION_TYPE = {
  [IMAGE_BYTES_ACTION_TYPES.UPDATE]: (_, action) => {
    const { payload: newImageBytes } = action
    return newImageBytes
  },
  [IMAGE_BYTES_ACTION_TYPES.CLEAR]: () => initialImageBytes
}

export const imageBytes = (state, action) => {
  const { type } = action

  const updateState = UPDATE_BY_ACTION_TYPE?.[type]

  return updateState ? updateState(state, action) : state
}
