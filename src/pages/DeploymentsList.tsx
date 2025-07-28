import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { supabase } from '../lib/supabase'
import type { WebApp, Environment, Instance } from '../types'
import { 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  Plus,
  Search,
  Filter
} from 'lucide-react'

interface DeploymentWithDetails extends WebApp {
  environment?: Environment
  instance?: Instance
}

const DeploymentsList: React.FC = () => {
  const navigate = useNavigate()
  const [deployments, setDeployments] = useState<DeploymentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchDeployments()
  }, [])

  const fetchDeployments = async () => {
    try {
      setLoading(true)
      
      // Fetch webapps with related data
      const { data: webapps, error: webappsError } = await supabase
        .from('webapps')
        .select(`
          *,
          environments (
            *,
            instances (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (webappsError) throw webappsError

      // Transform the data to flatten the structure
      const transformedDeployments: DeploymentWithDetails[] = webapps.map((webapp: any) => ({
        ...webapp,
        environment: webapp.environments?.[0] || null,
        instance: webapp.environments?.[0]?.instances?.[0] || null
      }))

      setDeployments(transformedDeployments)
    } catch (error) {
      console.error('Error fetching deployments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'deploying':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'stopped':
        return <Pause className="w-5 h-5 text-gray-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'deploying':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'stopped':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const filteredDeployments = deployments.filter(deployment => {
    const matchesSearch = deployment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deployment.owner.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || deployment.instance?.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStartDeployment = async (instanceId: string) => {
    try {
      await supabase
        .from('instances')
        .update({ status: 'running' })
        .eq('id', instanceId)
      
      fetchDeployments() // Refresh the list
    } catch (error) {
      console.error('Error starting deployment:', error)
    }
  }

  const handleStopDeployment = async (instanceId: string) => {
    try {
      await supabase
        .from('instances')
        .update({ status: 'stopped' })
        .eq('id', instanceId)
      
      fetchDeployments() // Refresh the list
    } catch (error) {
      console.error('Error stopping deployment:', error)
    }
  }

  const handleDeleteDeployment = async (webappId: string) => {
    if (!confirm('Are you sure you want to delete this deployment? This action cannot be undone.')) {
      return
    }

    try {
      // Get the environment ID first
      const { data: environment } = await supabase
        .from('environments')
        .select('id')
        .eq('webapp_id', webappId)
        .single()

      if (environment) {
        // Delete instances first
        await supabase
          .from('instances')
          .delete()
          .eq('environment_id', environment.id)
        
        // Delete environment
        await supabase
          .from('environments')
          .delete()
          .eq('id', environment.id)
      }
      
      // Delete webapp
      await supabase
        .from('webapps')
        .delete()
        .eq('id', webappId)
      
      fetchDeployments() // Refresh the list
    } catch (error) {
      console.error('Error deleting deployment:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909]">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-white">Loading deployments...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090909]">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Deployments</h1>
              <p className="text-gray-400">Manage and monitor your deployed applications</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Deployment</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search deployments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151515] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#151515] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="pending">Pending</option>
                <option value="deploying">Deploying</option>
                <option value="stopped">Stopped</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deployments Grid */}
        {filteredDeployments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Settings className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No deployments found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first deployment'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Create First Deployment
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeployments.map((deployment) => (
              <div key={deployment.id} className="bg-[#151515] rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{deployment.name}</h3>
                    <p className="text-gray-400 text-sm">{deployment.owner}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(deployment.instance?.status || 'pending')}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deployment.instance?.status || 'pending')}`}>
                      {deployment.instance?.status || 'pending'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Template:</span>
                    <span className="text-white">{deployment.template}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Plan:</span>
                    <span className="text-white">{deployment.plan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Region:</span>
                    <span className="text-white">{deployment.region}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Port:</span>
                    <span className="text-white">{deployment.environment?.port || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white">
                      {deployment.created_at 
                        ? new Date(deployment.created_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    {deployment.instance?.status === 'running' ? (
                      <button
                        onClick={() => handleStopDeployment(deployment.instance!.id!)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors p-2"
                        title="Stop deployment"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartDeployment(deployment.instance!.id!)}
                        className="text-gray-400 hover:text-green-400 transition-colors p-2"
                        title="Start deployment"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      className="text-gray-400 hover:text-blue-400 transition-colors p-2"
                      title="Open application"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteDeployment(deployment.id!)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-2"
                    title="Delete deployment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeploymentsList 