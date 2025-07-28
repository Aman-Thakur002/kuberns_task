import React from 'react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center space-x-4 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNum = index + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep
        
        return (
          <React.Fragment key={stepNum}>
            <div className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isActive ? 'bg-blue-600 text-white' : 
                  isCompleted ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}
              `}>
                {stepNum}
              </div>
            </div>
            {stepNum < totalSteps && (
              <div className={`w-12 h-0.5 ${isCompleted ? 'bg-green-600' : 'bg-gray-700'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default StepIndicator