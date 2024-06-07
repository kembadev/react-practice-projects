import { useState } from 'react'
import './App.css'
import { ScaleIcon, UndoIcon, RedoIcon, RotateRightIcon, RotateLeftIcon } from './components/Icons'

function App () {
  const [image, setImage] = useState(true)

  return (
    <>
        {
            image
              ? (<main>
                    <div className='canvasContainer'>
                        <canvas />
                    </div>
                    <section className='utilitiesContainer'>
                        <header className='mainControls'>
                            <article className='utility-rotate'>
                                <button title='Rotar a la izquierda'>
                                    <RotateLeftIcon />
                                </button>
                                <button title='Rotar a la derecha'>
                                    <RotateRightIcon />
                                </button>
                            </article>
                            <article className='utility-scale' title='Escalar imagen'>
                                <span><ScaleIcon /></span>
                                <input
                                    type='range'
                                    min='0.25'
                                    max='5'
                                    step='0.1'
                                />
                            </article>
                            <article className='utility-invert'>
                                <button title='Invertir imagen'>Invertir</button>
                            </article>
                        </header>
                        <div className='restoreActions'>
                            <button title='Deshacer'>
                                <UndoIcon />
                            </button>
                            <button title='Rehacer'>
                                <RedoIcon />
                            </button>
                        </div>
                    </section>
                    <button className='saveBtn' title='Guardar imagen'>Guardar</button>
                </main>)
              : (<form className='form-imageInput'>
                    <label title='Click para seleccionar una imagen'>
                        Seleccionar imagen
                        <input type='file' name='image' hidden />
                    </label>
                </form>)
        }
    </>
  )
}

export default App
