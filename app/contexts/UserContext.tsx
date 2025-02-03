"use client"

import { 
  createContext, 
  useContext, 
  ReactNode, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo 
} from "react"

// Enhanced types
type Theme = "light" | "dark" | "system"
export type SkinColor = "light" | "medium" | "dark"
type Language = "en" | "es" | "fr" | "de" | "zh"

interface UserPreferences {
  skinColor: SkinColor
  theme: Theme
  language: Language
  notifications: boolean
  compactView: boolean
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

interface UserContextType {
  // User state
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void

  // Preferences
  preferences: UserPreferences
  updatePreferences: (updates: Partial<UserPreferences>) => void

  // Authentication
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>

  // User actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>

  // Skin color
  skinColor: SkinColor
  setSkinColor: (color: SkinColor) => void
}

const DEFAULT_PREFERENCES: UserPreferences = {
  skinColor: "medium",
  theme: "system",
  language: "en",
  notifications: true,
  compactView: false
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
  initialPreferences?: Partial<UserPreferences>
}

export function UserProvider({
  children,
  initialPreferences = {}
}: UserProviderProps) {
  // Core state
  const [user, setUser] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...DEFAULT_PREFERENCES,
    ...initialPreferences
  })
  const [isLoading, setIsLoading] = useState(true)
  const [skinColor, setSkinColor] = useState<SkinColor>(DEFAULT_PREFERENCES.skinColor)

  // Load saved state from localStorage on mount
  useEffect(() => {
    const loadSavedState = () => {
      try {
        const savedUser = localStorage.getItem('user')
        const savedPreferences = localStorage.getItem('userPreferences')
        const savedSkinColor = localStorage.getItem('skinColor')

        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }

        if (savedPreferences) {
          setPreferences(prev => ({
            ...prev,
            ...JSON.parse(savedPreferences)
          }))
        }

        if (savedSkinColor) {
          setSkinColor(savedSkinColor as SkinColor)
        }
      } catch (error) {
        console.error('Error loading saved state:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedState()
  }, [])

  // Persist state changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
  }, [preferences])

  useEffect(() => {
    localStorage.setItem('skinColor', skinColor)
  }, [skinColor])

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }))
  }, [])

  // Authentication functions
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Implement your login logic here
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      // Implement your logout logic here
      await fetch('/api/logout', { method: 'POST' })
      setUser(null)
      // Optionally reset preferences to defaults
      setPreferences(DEFAULT_PREFERENCES)
      setSkinColor(DEFAULT_PREFERENCES.skinColor)
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('userPreferences')
      localStorage.removeItem('skinColor')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Profile update function
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      // Implement your profile update logic here
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }, [user])

  // Memoize context value
  const value = useMemo(() => ({
    user,
    setUser,
    preferences,
    updatePreferences,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateProfile,
    skinColor,
    setSkinColor
  }), [user, preferences, isLoading, login, logout, updateProfile, updatePreferences, skinColor, setSkinColor])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}

// Utility hooks for specific user data
export function useUserPreferences() {
  const { preferences, updatePreferences } = useUser()
  return { preferences, updatePreferences }
}

export function useUserProfile() {
  const { user, updateProfile } = useUser()
  return { user, updateProfile }
}

export function useAuth() {
  const { isAuthenticated, isLoading, login, logout } = useUser()
  return { isAuthenticated, isLoading, login, logout }
}
