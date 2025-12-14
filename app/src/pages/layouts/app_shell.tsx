// layout/AppShell.jsx (This is your main app wrapper)

import Sidebar from "@/features/navigation/side_bar"; // Adjust path
import PageLayout from "@/pages/layouts/page_layout"; // Adjust path

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <PageLayout>{children}</PageLayout>
    </div>
  );
}

export default AppShell;
