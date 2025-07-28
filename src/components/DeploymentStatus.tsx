import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react'

interface DeploymentStatusProps {
  isVisible: boolean
  onComplete: () => void
}

type DeploymentStage = 'pending' | 'building' | 'deploying' | 'running' | 'failed'

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ isVisible, onComplete }) => {
  const [currentStage, setCurrentStage] = useState<DeploymentStage>('pending')
  const [progress, setProgress] = useState(0)

  const stages = [
    { key: 'pending', label: 'Initializing...', icon: Clock },
    { key: 'building', label: 'Building application...', icon: Loader },
    { key: 'deploying', label: 'Deploying to cloud...', icon: Loader },
    { key: 'running', label: 'Application is live!', icon: CheckCircle }
  ]

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      switch (currentStage) {
        case 'pending':
          setCurrentStage('building')
          setProgress(25)
          break
        case 'building':
          setCurrentStage('deploying')
          setProgress(75)
          break
        case 'deploying':
          setCurrentStage('running')
          setProgress(100)
          setTimeout(() => onComplete(), 1000)
          break
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [currentStage, isVisible, onComplete])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div className="bg-[#090909] border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          Deploying Your Application
        </h3>

        <div className="space-y-4 mb-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            const isActive = stage.key === currentStage
            const isCompleted = stages.findIndex(s => s.key === currentStage) > index
            
            return (
              <div key={stage.key} className="flex items-center space-x-3">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-green-600' : isActive ? 'bg-blue-600' : 'bg-gray-700'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : (
                    <Icon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className={`${
                  isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-gray-400'
                }`}>
                  {stage.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="bg-[#151515] rounded-full h-2 mb-4">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="text-gray-400 text-center text-sm">
          This may take a few moments...
        </p>
      </div>
    </motion.div>
  )
}

export default DeploymentStatus