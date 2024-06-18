import './Crop.css'

import { useControls } from '../../hooks/useControls.js'
import { RotateLeftIcon, RotateRightIcon } from '../Icons.jsx'

export function Crop () {
  const { rotateToLeft, rotateToRight, invertImage } = useControls()

  return (
    <>
      <div className="rotateControls">
        <button title="Rotar a la izquierda" onClick={rotateToLeft}>
          <RotateLeftIcon />
        </button>
        <button title="Rotar a la derecha" onClick={rotateToRight}>
          <RotateRightIcon />
        </button>
      </div>
      <div className="invertControl">
        <button title="Invertir imagen" onClick={invertImage}>Invertir</button>
      </div>
    </>
  )
}
