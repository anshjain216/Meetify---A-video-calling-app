import { useState } from 'react'
import './App.css'
import {Route, BrowserRouter as Router,Routes} from "react-router-dom"
import Landing from './components/Landing.jsx'
import Login from './components/Authentication/Login.jsx'
import { Signup } from './components/Authentication/Signup.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </Router>
  )
}

export default App
