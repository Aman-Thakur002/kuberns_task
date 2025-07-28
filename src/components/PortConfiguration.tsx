import React from 'react'

interface PortConfigurationProps {
  useRandomPort: boolean
  customPort: string
  onRandomPortChange: (useRandom: boolean) => void
  onCustomPortChange: (port: string) => void
}

const PortConfiguration: React.FC<PortConfigurationProps> = ({
  useRandomPort,
  customPort,
  onRandomPortChange,
  onCustomPortChange
}) => {
  const assignedPort = useRandomPort ? Math.floor(Math.random() * 10000) + 3000 : customPort

  return (
    <div className="mb-8 bg-[#151515] px-6 py-6 rounded-xl">
      <h3 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-700">
        Port Configuration
      </h3>
      
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Description Section */}
        <div className="lg:w-1/3">
          <p className="text-gray-400 text-sm leading-relaxed">
            You can choose a specific port for your application, or we'll take care of it and assign one for you automatically.
          </p>
        </div>

        {/* Configuration Section */}
        <div className="lg:w-2/3 space-y-6">
          {/* Radio Button Options */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={useRandomPort}
                onChange={() => onRandomPortChange(true)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 "
              />
              <span className="text-white text-sm">🎲 Assign a random port</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={!useRandomPort}
                onChange={() => onRandomPortChange(false)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 "
              />
              <span className="text-white text-sm">⚙️ Set a Custom Port</span>
            </label>
          </div>

          {/* Port Display */}
          <div className="bg-[#090909] px-4 py-3 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">📱</span>
                <span className="text-gray-400">localhost:</span>
                <span className="text-blue-400 font-mono font-semibold">
                  {assignedPort || 'XXXX'}
                </span>
              </div>
              
              {useRandomPort && (
                <span className="text-green-400 text-sm flex items-center space-x-1">
                  <span>✅</span>
                  <span>Random Port Assigned</span>
                </span>
              )}
            </div>
          </div>

          {/* Custom Port Input */}
          {!useRandomPort && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Custom Port Number
              </label>
              <input
                type="number"
                value={customPort}
                onChange={(e) => onCustomPortChange(e.target.value)}
                placeholder="e.g., 3000, 8080, 5000"
                min="1000"
                max="65535"
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400 transition-colors"
              />
              <p className="text-xs text-gray-500">
                Port range: 1000-65535
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PortConfiguration