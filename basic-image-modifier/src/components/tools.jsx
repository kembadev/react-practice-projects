import { Crop } from './tools/Crop.jsx'

export const tools = [
  {
    name: 'Ajuste',
    Component: Crop
  },
  {
    name: 'Efectos',
    Component: () => <button>Sepia</button>
  },
  {
    name: 'Texto',
    Component: () => <button>Texto</button>
  }
]

export const initialTool = tools[0].name
