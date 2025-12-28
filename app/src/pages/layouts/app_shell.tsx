// layout/AppShell.jsx (This is your main app wrapper)

import Sidebar from "@/features/navigation/side_bar"; // Adjust path
import PageLayout from "@/pages/layouts/page_layout"; // Adjust path
import { useGlobalErrorState } from "@/store/useErrorState";
import ErrorCard from "@/features/error/error";

function AppShell({ children }: { children: React.ReactNode }) {
  const activeError = useGlobalErrorState((state: any) => state.activeError);
  const setError = useGlobalErrorState((state: any) => state.setError);
  const clearError = useGlobalErrorState((state: any) => state.clearError);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <PageLayout>
        <ErrorCard
          activeError={activeError}
          clearError={clearError}
          setError={setError}
        />
        {children}
      </PageLayout>
    </div>
  );
}

export default AppShell;
