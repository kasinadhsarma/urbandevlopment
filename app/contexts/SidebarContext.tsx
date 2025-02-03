"use client"

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback,
  useMemo 
} from "react"

interface SidebarState {
  isOpen: boolean
  width: number
  isCollapsed: boolean
  isMobile: boolean
}

interface SidebarContextType extends SidebarState {
  toggle: () => void
  setIsOpen: (open: boolean) => void
  setWidth: (width: number) => void
  collapse: () => void
  expand: () => void
  reset: () => void
}

const INITIAL_WIDTH = 260
const COLLAPSED_WIDTH = 64
const MOBILE_BREAKPOINT = 768

const DEFAULT_STATE: SidebarState = {
  isOpen: true,
  width: INITIAL_WIDTH,
  isCollapsed: false,
  isMobile: false
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export interface SidebarProviderProps {
  children: ReactNode
  initialState?: Partial<SidebarState>
}

export function SidebarProvider({ 
  children, 
  initialState = {} 
}: SidebarProviderProps) {
  // Merge default state with initial state
  const [state, setState] = useState<SidebarState>({
    ...DEFAULT_STATE,
    ...initialState
  })

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT
      setState(prev => ({
        ...prev,
        isMobile,
        // Auto collapse on mobile
        isOpen: isMobile ? false : prev.isOpen,
      }))
    }

    // Set initial mobile state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Toggle sidebar open/closed
  const toggle = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen,
      // Reset collapsed state when opening on desktop
      isCollapsed: !prev.isOpen && !prev.isMobile ? false : prev.isCollapsed
    }))
  }, [])

  // Set sidebar open state
  const setIsOpen = useCallback((open: boolean) => {
    setState(prev => ({ 
      ...prev, 
      isOpen: open,
      // Reset collapsed state when opening on desktop
      isCollapsed: open && !prev.isMobile ? false : prev.isCollapsed
    }))
  }, [])

  // Set sidebar width
  const setWidth = useCallback((width: number) => {
    setState(prev => ({ ...prev, width }))
  }, [])

  // Collapse sidebar (desktop only)
  const collapse = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCollapsed: true,
      width: COLLAPSED_WIDTH
    }))
  }, [])

  // Expand sidebar (desktop only)
  const expand = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCollapsed: false,
      width: INITIAL_WIDTH
    }))
  }, [])

  // Reset to default state
  const reset = useCallback(() => {
    setState(DEFAULT_STATE)
  }, [])

  // Memoize context value
  const value = useMemo(() => ({
    ...state,
    toggle,
    setIsOpen,
    setWidth,
    collapse,
    expand,
    reset
  }), [state, toggle, setIsOpen, setWidth, collapse, expand, reset])

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  
  return context
}

// Optional: Type-safe hook for specific sidebar values
export function useSidebarState<K extends keyof SidebarState>(key: K): SidebarState[K] {
  const context = useSidebar()
  return context[key]
}

// Optional: Hook for responsive sidebar behavior
export function useResponsiveSidebar() {
  const { 
    isMobile, 
    isOpen, 
    isCollapsed, 
    width,
    setIsOpen,
    collapse,
    expand 
  } = useSidebar()

  // Auto-collapse behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setIsOpen(false)
      } else if (width < 1024) {
        collapse()
      } else {
        expand()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsOpen, collapse, expand])

  return {
    isMobile,
    isOpen,
    isCollapsed,
    width,
    style: {
      width: isOpen ? width : 0,
      transition: 'width 0.3s ease'
    }
  }
}