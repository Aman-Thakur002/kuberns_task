import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { supabase } from '../lib/supabase'
import type { WebApp } from '../types'
import { 
  Plus, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader,
  ArrowRight,
  BarChart3,
  Zap,
  Globe
} from 'lucide-react'

type WebAppWithEnvironments = WebApp & {
  environments?: Array<{
    instances?: Array<any>
  }>
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [deployments, setDeployments] = useState<WebAppWithEnvironments[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    pending: 0,
    failed: 0
  })

  useEffect(() => {
    fetchDeployments()
  }, [])

  const fetchDeployments = async () => {
    try {
      setLoading(true)
      
      const { data: webapps, error } = await supabase
        .from('webapps')
        .select(`
          *,
          environments (
            instances (*)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      setDeployments(webapps || [])

      // Calculate stats
      const total = webapps?.length || 0
      let running = 0, pending = 0, failed = 0

      webapps?.forEach(webapp => {
        const instance = webapp.environments?.[0]?.instances?.[0]
        if (instance) {
          switch (instance.status) {
            case 'running':
              running++
              break
            case 'pending':
            case 'deploying':
              pending++
              break
            case 'failed':
              failed++
              break
          }
        }
      })

      setStats({ total, running, pending, failed })
    } catch (error) {
      console.error('Error fetching deployments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'deploying':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-400'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400'
      case 'deploying':
        return 'bg-blue-500/10 text-blue-400'
      case 'failed':
        return 'bg-red-500/10 text-red-400'
      default:
        return 'bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-[#090909]">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Kuberns</h1>
          <p className="text-gray-400">Deploy and manage your applications with ease</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#151515] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Deployments</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-[#151515] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Running</p>
                <p className="text-2xl font-bold text-green-400">{stats.running}</p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-[#151515] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-[#151515] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Create New Deployment */}
          <div className="bg-[#151515] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Create New Deployment</h2>
              <Plus className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-400 mb-6">
              Deploy a new application by connecting your repository and configuring the environment.
            </p>
            <button
              onClick={() => navigate('/app-setup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Start New Deployment</span>
            </button>
          </div>

          {/* View All Deployments */}
          <div className="bg-[#151515] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Manage Deployments</h2>
              <Globe className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-gray-400 mb-6">
              View, monitor, and manage all your deployed applications in one place.
            </p>
            <button
              onClick={() => navigate('/deployments')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <span>View All Deployments</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="bg-[#151515] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Deployments</h2>
            <button
              onClick={() => navigate('/deployments')}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-3 text-gray-400">Loading deployments...</span>
            </div>
          ) : deployments.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No deployments yet</h3>
              <p className="text-gray-400 mb-4">Get started by creating your first deployment</p>
              <button
                onClick={() => navigate('/app-setup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Create First Deployment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {deployments.map((deployment) => {
                const instance = deployment.environments?.[0]?.instances?.[0]
                return (
                  <div key={deployment.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(instance?.status || 'pending')}
                      <div>
                        <h3 className="text-white font-medium">{deployment.name}</h3>
                        <p className="text-gray-400 text-sm">{deployment.template} • {deployment.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(instance?.status || 'pending')}`}>
                        {instance?.status || 'pending'}
                      </span>
                      <button
                        onClick={() => navigate('/deployments')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 