import React from 'react'
import { UserMenuWithSession } from '@/features/dashboard/components/user-menu'

function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <UserMenuWithSession variant="compact"/>
    </div>
  )
}

export default DashboardPage