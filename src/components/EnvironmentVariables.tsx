import React from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'

interface EnvironmentVariablesProps {
  envVars: Record<string, string>
  onEnvVarsChange: (envVars: Record<string, string>) => void
}

const EnvironmentVariables: React.FC<EnvironmentVariablesProps> = ({
  envVars,
  onEnvVarsChange
}) => {
  const envVarEntries = Object.entries(envVars)

  const addNewVar = () => {
    const newKey = `NEW_VAR_${Object.keys(envVars).length + 1}`
    onEnvVarsChange({
      ...envVars,
      [newKey]: 'https://api.example.com'
    })
  }

  const updateVar = (oldKey: string, newKey: string, value: string) => {
    const newEnvVars = { ...envVars }
    delete newEnvVars[oldKey]
    newEnvVars[newKey] = value
    onEnvVarsChange(newEnvVars)
  }

  const deleteVar = (key: string) => {
    const newEnvVars = { ...envVars }
    delete newEnvVars[key]
    onEnvVarsChange(newEnvVars)
  }

  return (
    <div className="mb-8 bg-[#151515] px-6 py-6 rounded-xl">
      <div className="flex items-center justify-between mb-4 border-b border-dashed py-2">
        <h3 className="text-xl font-semibold text-white">Configure Environment <p> Variables</p></h3>
       <div>
       <p> Need Help?</p>
        <a href="#" className="text-blue-400 text-sm hover:underline">
          Refer to our GitHub support resources for a smoother experience.
        </a>
       </div>
      </div>

      <p className="text-gray-400 mb-6">
        Manage and customize environment variables for your application. Environment variables are key-value pairs that allow you to configure settings, API endpoints, and sensitive information specific to each environment. Add, edit, or delete variables to tailor your application's behavior and integration with external services.
      </p>

      <div className="bg-[#151515] rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-700 text-gray-300 text-sm font-medium">
          <div className="col-span-4 p-4">Key</div>
          <div className="col-span-6 p-4">Value</div>
          <div className="col-span-2 p-4">Actions</div>
        </div>

        {envVarEntries.map(([key, value], index) => (
          <EnvVarRow
            key={key}
            index={index}
            envKey={key}
            value={value}
            onUpdate={(newKey, newValue) => updateVar(key, newKey, newValue)}
            onDelete={() => deleteVar(key)}
          />
        ))}

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={addNewVar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>
    </div>
  )
}

interface EnvVarRowProps {
  index: number
  envKey: string
  value: string
  onUpdate: (key: string, value: string) => void
  onDelete: () => void
}

const EnvVarRow: React.FC<EnvVarRowProps> = ({
  index,
  envKey,
  value,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editKey, setEditKey] = React.useState(envKey)
  const [editValue, setEditValue] = React.useState(value)

  const handleSave = () => {
    onUpdate(editKey, editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditKey(envKey)
    setEditValue(value)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="grid grid-cols-12 border-t border-gray-700 bg-gray-750">
        <div className="col-span-4 p-4">
          <input
            type="text"
            value={editKey}
            onChange={(e) => setEditKey(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-6 p-4">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-2 p-4 flex space-x-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 border-t border-gray-700 hover:bg-gray-750">
      <div className="col-span-4 p-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">🔗</span>
          <span className="text-white font-mono">{envKey}</span>
        </div>
      </div>
      <div className="col-span-6 p-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">📝</span>
          <span className="text-gray-300 font-mono truncate">{value}</span>
        </div>
      </div>
      <div className="col-span-2 p-4 flex space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-400 hover:text-blue-300 p-1"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default EnvironmentVariables