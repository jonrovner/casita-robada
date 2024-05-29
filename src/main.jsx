import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import App2 from './App2.jsx'
import './index.css'
import { DndProvider } from 'react-dnd'
	import { HTML5Backend } from 'react-dnd-html5-backend'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>

   
    <App2 />

    </DndProvider>
  </React.StrictMode>,
)
