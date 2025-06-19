import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth.js'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: () => (
    <DashboardPage />
  ),
})

function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your Dashboard
              </h2>
              <p className="text-gray-600 mb-4">
                Dashboard content will be implemented here
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md mx-auto">
                <h3 className="text-sm font-medium text-blue-800 mb-2">User Information</h3>
                <p className="text-sm text-blue-600">Email: {user.email}</p>
                <p className="text-sm text-blue-600">User ID: {user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 