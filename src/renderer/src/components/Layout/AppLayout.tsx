import React from 'react'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps): React.JSX.Element {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {children}
    </div>
  )
}
