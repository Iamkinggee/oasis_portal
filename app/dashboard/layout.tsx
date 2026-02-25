

import ThemeProvider from "@/app/components/ThemeProvider";
import DashboardShell from "@/app/components/DashboardShell";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </ThemeProvider>
  );
}



