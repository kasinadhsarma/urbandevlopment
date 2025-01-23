"use client"

import React, { createContext, useState, useContext, type ReactNode } from "react"

type SkinColor = "light" | "medium" | "dark"

interface UserContextType {
  skinColor: SkinColor
  setSkinColor: (color: SkinColor) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [skinColor, setSkinColor] = useState<SkinColor>("medium")

  return <UserContext.Provider value={{ skinColor, setSkinColor }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

