import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CircuitList from './components/CircuitList'
import CircuitDetail from './components/CircuitDetail'
import DriverManagement from './components/DriverManagement'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-8">
          <Routes>
            <Route path="/" element={<CircuitList />} />
            <Route path="/circuit/:circuitId" element={<CircuitDetail />} />
            <Route path="/drivers" element={<DriverManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App