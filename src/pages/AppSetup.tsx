import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepIndicator from '../components/StepIndicator'
import GitHubConnection from '../components/GitHubConnection'
import AppDetailsForm from '../components/AppDetailsForm'
import DatabaseSelection from '../components/DatabaseSelection'

const AppSetup: React.FC = () => {
  const navigate = useNavigate()
  
  // GitHub connection state
  const [selectedOrg, setSelectedOrg] = useState('Adith Narein T')
  const [selectedRepo, setSelectedRepo] = useState('Kuberns Page')
  const [selectedBranch, setSelectedBranch] = useState('main')
  
  // App details state
  const [appName, setAppName] = useState('CloudCity')
  const [region, setRegion] = useState('United States - Michigan')
  const [template, setTemplate] = useState('Vue.js')
  const [plan, setPlan] = useState('Starter')
  
  // Database state
  const [connectDatabase, setConnectDatabase] = useState(false)

  const handleNext = () => {
    // Store form data in localStorage for the next step
    const formData = {
      org: selectedOrg,
      repo: selectedRepo,
      branch: selectedBranch,
      appName,
      region,
      template,
      plan,
      connectDatabase
    }
    localStorage.setItem('appSetupData', JSON.stringify(formData))
    navigate('/environment-config')
  }

  return (
    <div className="min-h-screen bg-[#090909]">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
         <div>
         <h1 className="text-3xl font-bold text-white mb-2">Create New App</h1>
         <p className="text-gray-400">Connect your repository and fill in the requirements to see the app deployed in seconds.</p>
         <div className="mt-2">
           <button
             onClick={() => navigate('/deployments')}
             className="text-blue-400 hover:text-blue-300 text-sm underline"
           >
             View all deployments →
           </button>
         </div>
         </div>
          <StepIndicator currentStep={1} totalSteps={2} />
        </div>
       
        <div className="space-y-8">
          <div className="bg-[#151515] border border-gray-700 rounded-xl shadow-lg px-4 py-2">
            <GitHubConnection
              selectedOrg={selectedOrg}
              selectedRepo={selectedRepo}
              selectedBranch={selectedBranch}
              onOrgChange={setSelectedOrg}
              onRepoChange={setSelectedRepo}
              onBranchChange={setSelectedBranch}
            />
          </div>
          <div className="bg-[#151515] border border-gray-700 rounded-xl shadow-lg px-4 py-2">
            <AppDetailsForm
              appName={appName}
              region={region}
              template={template}
              plan={plan}
              onAppNameChange={setAppName}
              onRegionChange={setRegion}
              onTemplateChange={setTemplate}
              onPlanChange={setPlan}
            />
          </div>
          <div className="bg-[#151515] border border-gray-700 rounded-xl shadow-lg px-4 ">
            <DatabaseSelection
              connectDatabase={connectDatabase}
              onConnectChange={setConnectDatabase}
            />
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-md transition-colors"
          >
            <span>Set Up Env Variables</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppSetup