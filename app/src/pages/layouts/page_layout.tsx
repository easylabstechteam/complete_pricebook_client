// components/PageLayout.jsx (or similar)
import React from "react";
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    // Removed justify-center and items-start to allow child to control positioning
    <div className="relative h-full w-full overflow-hidden bg-stone-50">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}

export default PageLayout;
