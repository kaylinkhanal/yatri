'use client'
import { Card } from '@/components/ui/card'
import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
     <div onClick={()=> router.push('/') } className='absolute top-4 left-4 z-50 p-2 bg-[#f4c534] rounded-full shadow-md cursor-pointer'>
     <HomeIcon/>
     </div>
    {children}

  </div>
  )
}

export default Layout