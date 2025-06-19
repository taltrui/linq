import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface AuthContextType {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  authenticated: boolean
}

interface User {
  id: string
  email: string
  name: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    name: '',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('auth-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === 'admin@test.com' && password === 'password') {
      const userData: User = {
        id: '1',
        email,
        name: 'Admin User'
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser(userData)
      localStorage.setItem('auth-user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser({
      id: '',
      email: '',
      name: ''
    })
    localStorage.removeItem('auth-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, authenticated: user.id !== '' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 