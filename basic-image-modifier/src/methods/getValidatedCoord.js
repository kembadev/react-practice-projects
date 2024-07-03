import { Result } from '../utils.js'

export function getValidatedCoord ({ desiredCoord, widthLimit = null, heightLimit = null }) {
  if (widthLimit === null && heightLimit === null) return 0

  let usableCoord

  const lengthComparison = widthLimit ?? heightLimit
  if (desiredCoord < 0 || desiredCoord > lengthComparison) {
    usableCoord = Result.Failed({ error: desiredCoord < 0 ? 0 : lengthComparison })
  } else {
    usableCoord = Result.Successful(desiredCoord)
  }

  return usableCoord.success ? usableCoord.value : usableCoord.error
}
