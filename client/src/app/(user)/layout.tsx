import { Card } from '@/components/ui/card'
import React from 'react'



import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export  function SidebarLayout({children}) {
  return (
    <SidebarProvider>
      <AppSidebar />
  
      <main>
        <SidebarTrigger />
      
      </main>
    </SidebarProvider>
  )
}
const Layout = ({children}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-red-200 p-4">
        <SidebarLayout/>
    <Card className="w-full max-w-md bg-white text-gray-900 shadow-md border-gray-200">
    {children}
    </Card>
  </div>
  )
}

export default Layout