import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p className="text-center text-gray-600">
            Login form will be implemented here
          </p>
        </div>
      </div>
    </div>
  )
} 