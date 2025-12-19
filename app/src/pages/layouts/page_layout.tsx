// components/PageLayout.jsx (or similar)
import React from "react";
function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full flex justify-center items-start p-10 overflow-y-auto">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}; 

export default PageLayout
