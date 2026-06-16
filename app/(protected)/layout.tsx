import { requireAuth } from "@/features/auth/actions";
import React from "react";

async function DashboardLayout({children,}:{children:React.ReactNode;}) {
  await requireAuth();
  return (
    <div>
      {children}
    </div>
  )
}

export default DashboardLayout