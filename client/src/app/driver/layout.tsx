import { Card } from '@/components/ui/card'
import React from 'react'



import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Bell } from 'lucide-react'
import { NotificationBell } from '@/components/notifications'

export  function SidebarLayout({children}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
       {children}
      </main>
    </SidebarProvider>
  )
}
const Layout = ({children}) => {
  return (
    <div className="flex min-h-screen  bg-red-200 p-4">
        <SidebarLayout>
            {children}
        </SidebarLayout>
        <div className='absolute top-4 right-12 rounded-full'>
            <NotificationBell/>
      
     </div>
   
  </div>
  )
}

export default Layout