import { InputFile } from "@/features/uploads/file_upload";
import AppShell from "@/pages/layouts/app_shell";
import { ViewUploadedContents } from "@/features/uploads/view_uploaded_content";
import { useUploadState } from "@/store/useUploadState";

function UploadPage() {
  const excelFile = useUploadState((state: any) => state.excelFile);
  const setSaveData = useUploadState((state: any) => state.setSaveData);

  // Check if we have data to display
  const hasData = excelFile && excelFile.length > 0;

  return (
    <AppShell>
      <div className="flex flex-col h-full w-full relative">
        {/* CENTER SECTION: Table shows here if data exists, otherwise empty space */}
        <div
          className={`flex-grow overflow-hidden transition-all duration-500 ${
            hasData ? "opacity-100" : "opacity-0"
          }`}
        >
          {hasData && <ViewUploadedContents />}
        </div>

        {/* INPUT SECTION: Transitions from Center to Bottom */}
        <div
          className={`
          transition-all duration-700 ease-in-out flex items-center justify-center
          ${
            hasData
              ? "h-24 border-t border-stone-200 bg-white" // Positioned at bottom
              : "absolute inset-0 z-10" // Centered on screen
          }
        `}
        >
          <div className="w-full max-w-4xl">
            <InputFile
              onUploadSuccess={(data) => setSaveData(data)}
              isMinimized={hasData}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default UploadPage;
