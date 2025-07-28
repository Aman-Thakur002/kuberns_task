import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AppSetup from './pages/AppSetup'
import EnvironmentConfig from './pages/EnvironmentConfig'
import DeploymentsList from './pages/DeploymentsList'
import { supabase } from './lib/supabase'

function App() {
  useEffect(() => {
    // Test Supabase connection
    supabase.from('webapps').select('*').limit(1).then((result) => {
      if (result.error) {
        console.error('Supabase connection test failed:', result.error)
      } else {
        console.log('Supabase connection test succeeded:', result.data)
      }
    })
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/app-setup" element={<AppSetup />} />
        <Route path="/environment-config" element={<EnvironmentConfig />} />
        <Route path="/deployments" element={<DeploymentsList />} />
      </Routes>
    </Router>
  )
}

export default App