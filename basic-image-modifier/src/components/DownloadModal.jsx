import './DownloadModal.css'

import { forwardRef, useEffect, useId, useState } from 'react'

import { CancelIcon } from './Icons.jsx'

import { useImageFile } from '../hooks/useImageFile.js'
import { useCanvas } from '../hooks/useCanvas.js'

import PropTypes from 'prop-types'

const formatOptions = [
  'webp',
  'png',
  'jpeg'
]

const DownloadModal = forwardRef((_, modal) => {
  const [filename, setFilename] = useState('')
  const [scaleSelected, setScaleSelected] = useState(1)

  const { userImageFile } = useImageFile()
  const { canvas, currentCanvasDimensions, scaling } = useCanvas()

  useEffect(() => {
    if (!userImageFile) return

    const { type } = userImageFile
    const extension = type.split('/').at(-1)
    setFilename(userImageFile.name.replace(`.${extension}`, ''))
  }, [userImageFile])

  const handleFilenameOnChange = e => {
    setFilename(e.target.value)
  }

  const handleScalingOnChange = e => {
    setScaleSelected(e.target.value)
  }

  const handleOnSubmit = e => {
    e.preventDefault()

    const { scale, name, format: desiredFormat } = Object.fromEntries(new FormData(e.target))

    if (!scale || !name || !desiredFormat) return

    if (!formatOptions.some(format => format.toLowerCase() === desiredFormat.toLowerCase())) return

    const { width: canvasWidth, height: canvasHeight } = currentCanvasDimensions
    const { x: scaleX, y: scaleY } = scaling

    const dataURL = canvas.current.toDataURL(desiredFormat, 1)
    const imgElement = document.createElement('img')
    imgElement.src = dataURL

    const imgWidth = Math.floor(scaleSelected * (canvasWidth / scaleX))
    const imgHeight = Math.floor(scaleSelected * (canvasHeight / scaleY))

    const canvasMock = new OffscreenCanvas(imgWidth, imgHeight)
    const contextMock = canvasMock.getContext('2d')

    const onLoadImage = async () => {
      contextMock.drawImage(imgElement, 0, 0, imgWidth, imgHeight)

      const blob = await canvasMock.convertToBlob({ type: `image/${desiredFormat}`, quality: 1 })
      const url = URL.createObjectURL(blob)

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = name
      anchor.click()

      imgElement.removeEventListener('load', onLoadImage)
      imgElement.remove()
      anchor.remove()
    }

    imgElement.addEventListener('load', onLoadImage)
    imgElement.addEventListener('error', () => { console.log('download failed') })
  }

  const filenameInputId = useId()

  return (
    <dialog className='modal' ref={modal} aria-modal='true' id='download-modal'>
      <form className='config' onSubmit={handleOnSubmit}>
        <div className='inputsContainer'>
          <section className='scale'>
            <article>
              <input
                type='range'
                name='scale'
                min={0.25}
                max={4.25}
                value={scaleSelected}
                step={0.05}
                onChange={handleScalingOnChange}
              />
              <span>{scaleSelected}x</span>
            </article>
            <p>
              Resolución:&nbsp;
              <span title='Ancho'>
                {Math.floor(scaleSelected * (currentCanvasDimensions.width / scaling.x))}px
              </span>
              &nbsp;<small>x</small>&nbsp;
              <span title='Alto'>
                {Math.floor(scaleSelected * (currentCanvasDimensions.height / scaling.y))}px
              </span>
            </p>
          </section>
          <section className='format-name_container'>
            <label htmlFor={filenameInputId}>Nombre de la imagen</label>
            <div>
              <input
                type='text'
                name='name'
                id={filenameInputId}
                placeholder='viaje_egipto'
                title={filename}
                value={filename}
                onChange={handleFilenameOnChange}
                autoComplete='off'
                spellCheck='false'
              />
              <select
                name='format'
                defaultValue={formatOptions.find(
                  format => format === userImageFile?.type.split('/').at(-1)
                ) ?? 'png'}
              >
                {
                  formatOptions.sort().map(format => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))
                }
              </select>
            </div>
          </section>
          {/* <span style={{ textAlign: 'right' }}>Tamaño final: <em>1</em></span> */}
        </div>

        <header>
          <button className='download' type='submit'>
            Descargar
          </button>
          <button
            className='cancel'
            type='button'
            title='Cancelar'
            aria-label='close-modal'
            onClick={() => { modal.current.close() }}
          >
            <CancelIcon />
          </button>
        </header>
      </form>
    </dialog>
  )
})

export default DownloadModal

DownloadModal.displayName = 'DownloadModal'

DownloadModal.propTypes = {
  modal: PropTypes.object
}
