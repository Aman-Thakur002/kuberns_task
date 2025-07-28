export interface WebApp {
  id?: string
  name: string
  owner: string
  region: string
  template: string
  plan: string
  cpu: number
  ram: number
  bandwidth: number
  repository: string
  branch: string
  created_at?: string
}

export interface Environment {
  id?: string
  webapp_id: string
  port: number
  env_variables: Record<string, string>
  created_at?: string
}

export interface Instance {
  id?: string
  environment_id: string
  cpu: number
  ram: number
  storage: number
  status: 'pending' | 'deploying' | 'running' | 'stopped' | 'failed'
  created_at?: string
}

export interface DatabaseConfig {
  id?: string
  webapp_id: string
  db_type: string
  db_user: string
  db_password: string
  db_name: string
  created_at?: string
}

export interface PlanDetails {
  storage: string
  bandwidth: string
  memory: string
  cpu: string
  monthlyCost: string
  pricePerHour: string
  description: string
}

export const planDetails: Record<string, PlanDetails> = {
  Starter: {
    storage: '10 GB',
    bandwidth: '10 GB',
    memory: '10 GB',
    cpu: '2 GB',
    monthlyCost: '₹0',
    pricePerHour: '₹0',
    description: 'Ideal for personal blogs and small websites'
  },
  Pro: {
    storage: '50 GB',
    bandwidth: '100 GB',
    memory: '50 GB',
    cpu: '8 GB',
    monthlyCost: '₹2000',
    pricePerHour: '₹5',
    description: 'Perfect for production applications'
  }
}