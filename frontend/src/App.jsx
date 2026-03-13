import { useState } from 'react'
import './App.css'
import {Route, BrowserRouter as Router,Routes} from "react-router-dom"
import Landing from './components/Landing.jsx'
import Login from './components/Authentication/Login.jsx'
import { Signup } from './components/Authentication/Signup.jsx'
import VideoMeet from './components/VideoMeet.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/:url' element={<VideoMeet/>}/>
      </Routes>
    </Router>
  )
}

export default App
