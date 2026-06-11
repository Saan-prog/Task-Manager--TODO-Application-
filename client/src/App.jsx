import React from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoutes from './components/ProtectedRoutes'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Navbar from './components/Navbar'


const App = () => {
  return (
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" 
                  element={<ProtectedRoutes>
                    {/* <Navbar/> */}
                    <Dashboard/>
                    </ProtectedRoutes>}/>
    </Routes>
    </BrowserRouter>
   
  )
}

export default App