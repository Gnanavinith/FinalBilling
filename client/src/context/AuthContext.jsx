import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'mobilebill:auth'

const defaultAuth = {
  isAuthenticated: false,
  user: null, // { email, role: 'admin' | 'staff' }
}

const AuthContext = createContext({
  auth: defaultAuth,
  isInitialized: false,
  login: async (_email, _password) => {},
  logout: () => {},
})

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(defaultAuth)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === 'object' && parsed.isAuthenticated) {
            // If we have a token, verify it with the server
            if (parsed.token) {
              try {
                const response = await fetch('http://localhost:5000/api/auth/verify', {
                  headers: {
                    'Authorization': `Bearer ${parsed.token}`,
                  },
                })
                if (response.ok) {
                  setAuth(parsed)
                } else {
                  // Token is invalid, clear auth state
                  setAuth(defaultAuth)
                }
              } catch (error) {
                console.error('Token verification failed:', error)
                // If server is not available, use stored auth state
                setAuth(parsed)
              }
            } else {
              setAuth(parsed)
            }
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error)
      } finally {
        setIsInitialized(true)
      }
    }
    
    loadAuthState()
  }, [])

  // Save authentication state to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
      } catch (error) {
        console.error('Error saving auth state:', error)
      }
    }
  }, [auth, isInitialized])

  const login = useCallback(async (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedPassword = String(password || '').trim()
    
    try {
      // Use server-side authentication
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: normalizedPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Login failed')
      }

      const { token, user } = await response.json()
      
      // Store token and user info
      setAuth({ 
        isAuthenticated: true, 
        user: user,
        token: token 
      })
    } catch (error) {
      // Fallback to client-side authentication for development
      let role = null
      if (normalizedEmail === 'admin@gmail.com') role = 'admin'
      if (normalizedEmail === 'staff@gmail.com') role = 'staff'

      if (!role) {
        throw new Error('Invalid email or password')
      }

      if (normalizedPassword !== '123456') {
        throw new Error('Invalid email or password')
      }

      setAuth({ isAuthenticated: true, user: { email: normalizedEmail, role } })
    }
  }, [])

  const logout = useCallback(() => {
    setAuth(defaultAuth)
  }, [])

  const value = useMemo(() => ({ auth, isInitialized, login, logout }), [auth, isInitialized, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


