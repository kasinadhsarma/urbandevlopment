"use client"

import { createContext, useContext, ReactNode, useState } from "react"

type SkinColor = "light" | "medium" | "dark"

interface User {
  id: string
  name: string
  email: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  skinColor: SkinColor
  setSkinColor: (color: SkinColor) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [skinColor, setSkinColor] = useState<SkinColor>("medium")

  return (
    <UserContext.Provider value={{ user, setUser, skinColor, setSkinColor }}>
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
