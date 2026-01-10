"use client"

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"

type SidebarContextValue = {
  minimized: boolean
  setMinimized: (value: boolean) => void
  toggle: () => void
}

const SidebarContext =
  createContext<SidebarContextValue | undefined>(
    undefined,
  )

export function SidebarProvider({
  children,
}: {
  children: ReactNode
}) {
  const [minimized, setMinimized] =
    useState(false)

  return (
    <SidebarContext.Provider
      value={{
        minimized,
        setMinimized,
        toggle: () =>
          setMinimized((v) => !v),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error(
      "useSidebar must be used within SidebarProvider",
    )
  }

  return context
}
