import './App.css'
import { ImageBytesProvider } from './context/imageBytes.jsx'
import { CanvasProvider } from './context/canvas.jsx'
import { UserView } from './components/UserView.jsx'

function App () {
  return (
    <ImageBytesProvider>
      <CanvasProvider>
        <UserView />
      </CanvasProvider>
    </ImageBytesProvider>
  )
}

export default App
