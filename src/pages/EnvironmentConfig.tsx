import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepIndicator from '../components/StepIndicator'
import PortConfiguration from '../components/PortConfiguration'
import EnvironmentVariables from '../components/EnvironmentVariables'
import DeploymentStatus from '../components/DeploymentStatus'
import { supabase } from '../lib/supabase'
import type { WebApp, Environment, Instance } from '../types'
import { ChevronsLeft } from 'lucide-react'

const EnvironmentConfig: React.FC = () => {
  const navigate = useNavigate()
  
  // Port configuration state
  const [useRandomPort, setUseRandomPort] = useState(true)
  const [customPort, setCustomPort] = useState('3000')
  
  // Environment variables state
  const [envVars, setEnvVars] = useState<Record<string, string>>({
    'API_URL': 'https://api.example.com',
    'DATABASE_URL': 'https://api.example.com',
    'SECRET_KEY': 'https://api.example.com',
    'REDIS_URL': 'https://api.example.com'
  })

  const [showDeployment, setShowDeployment] = useState(false)
  const [appSetupData, setAppSetupData] = useState<any>(null)

  useEffect(() => {
    // Load app setup data from previous step
    const data = localStorage.getItem('appSetupData')
    if (data) {
      setAppSetupData(JSON.parse(data))
    } else {
      // Redirect back to setup if no data
      navigate('/')
    }
  }, [navigate])

  const handleFinishSetup = async () => {
    if (!appSetupData) return
    
    try {
      setShowDeployment(true)
      
      // Create WebApp record
      const webAppData: Omit<WebApp, 'id' | 'created_at'> = {
        name: appSetupData.appName,
        owner: appSetupData.org,
        region: appSetupData.region,
        template: appSetupData.template,
        plan: appSetupData.plan,
        cpu: appSetupData.plan === 'Starter' ? 2 : 8,
        ram: appSetupData.plan === 'Starter' ? 10 : 50,
        bandwidth: appSetupData.plan === 'Starter' ? 10 : 100,
        repository: appSetupData.repo,
        branch: appSetupData.branch
      }

      const { data: webApp, error: webAppError } = await supabase
        .from('webapps')
        .insert(webAppData)
        .select()
        .single()

      if (webAppError) throw webAppError

      // Create Environment record
      const envData: Omit<Environment, 'id' | 'created_at'> = {
        webapp_id: webApp.id,
        port: useRandomPort ? Math.floor(Math.random() * 10000) + 3000 : parseInt(customPort),
        env_variables: envVars
      }

      const { data: environment, error: envError } = await supabase
        .from('environments')
        .insert(envData)
        .select()
        .single()

      if (envError) throw envError

      // Create Instance record
      const instanceData: Omit<Instance, 'id' | 'created_at'> = {
        environment_id: environment.id,
        cpu: webAppData.cpu,
        ram: webAppData.ram,
        storage: webAppData.plan === 'Starter' ? 10 : 50,
        status: 'pending'
      }

      const { error: instanceError } = await supabase
        .from('instances')
        .insert(instanceData)

      if (instanceError) throw instanceError

      console.log('App deployment initiated successfully!')
      
    } catch (error) {
      console.error('Error creating app:', error)
      setShowDeployment(false)
    }
  }

  const handleDeploymentComplete = async () => {
    setShowDeployment(false)
    // Clear stored data
    localStorage.removeItem('appSetupData')

    // Update instance status to 'running'
    try {
      // Find the environment for this webapp (latest one)
      const { data: environment } = await supabase
        .from('environments')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (environment) {
        // Find the instance for this environment
        const { data: instance } = await supabase
          .from('instances')
          .select('id')
          .eq('environment_id', environment.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        if (instance) {
          await supabase
            .from('instances')
            .update({ status: 'running' })
            .eq('id', instance.id)
        }
      }
    } catch (e) {
      // Optionally log error
      console.error('Failed to update instance status to running:', e)
    }

    // Navigate to dashboard
    navigate('/')
  }

  if (!appSetupData) {
    return <div className="min-h-screen bg-[#090909] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-[#090909]">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold text-white mb-2">Create New App</h1>
          <p className="text-gray-400">Connect your repository and fill in the requirements to see the app deployed in seconds.</p>
          </div>
          <StepIndicator currentStep={2} totalSteps={2} />
        </div>

       

        <PortConfiguration
          useRandomPort={useRandomPort}
          customPort={customPort}
          onRandomPortChange={setUseRandomPort}
          onCustomPortChange={setCustomPort}
        />

        <EnvironmentVariables
          envVars={envVars}
          onEnvVarsChange={setEnvVars}
        />

        <div className="flex justify-end items-center gap-3">
          <button
            onClick={()=>navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <ChevronsLeft/>
            <span>Prev</span>
            
          </button>
          <button
            onClick={handleFinishSetup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <span>Finish my Setup</span>
            <span>🚀</span>
          </button>
        </div>
      </div>

      <DeploymentStatus
        isVisible={showDeployment}
        onComplete={handleDeploymentComplete}
      />
    </div>
  )
}

export default EnvironmentConfig