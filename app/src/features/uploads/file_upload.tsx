import processExcelFile from "@/services/upload/file_upload";
import { Upload, FileText } from "lucide-react";
import { useState } from "react";

/**
 * InputFile
 * This functional component manages the UI presentation for file selection.
 * It uses local state to provide immediate feedback (displaying the file name)
 * and delegates the asynchronous data processing to an external service function.
 */
function InputFile() {
  // Local Component State: Holds the name of the file selected by the user.
  const [currentUploadName, setCurrentUploadName] = useState<string | null>(
    null
  );

  /**
   * Handler for the file input change event.
   * Responsibility: Capture the selected file's metadata for UI display and
   * initiate the heavy-duty data processing.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Safely retrieve the first file from the FileList object, common in file inputs.
    const file = e.target.files?.[0]; 

    // Conditional Control Flow: Check if a file was actually selected (not canceled).
    if (file) {
      // 1. UI Feedback (Synchronous): Update local React state with the file's name.
      setCurrentUploadName(file.name); 

      // 2. Business Logic Delegation (Asynchronous): Pass the full event 
      // object to the external service function. 
      processExcelFile(e); 
      
      // Optional: e.target.value = ''; 
    } else {
      // Cleanup: If the selection was canceled, reset the state.
      setCurrentUploadName(null);
    }
  };

  return (
    // Outer Padding: Provides standard spacing around the component.
    <div className="p-4 sm:p-6 md:p-8">
      <div
        className="
          // Layout and Sizing
          w-full mx-auto
          p-4 sm:p-8 md:p-12
          
          // Styling
          bg-white rounded-2xl 
          border border-gray-400 border-1
          shadow-lg
          
          // Hover Effect
          transition-all duration-300 hover:shadow-xl
        "
      >
        
        {/* 1. Header Block */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Upload Data File
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Accepts only `.xlsx` and `.xls` formats.
          </p>
        </div>
        
        {/* 2. Input Area / Dropzone */}
        <div
          className="
            relative flex flex-col items-center justify-center h-40 sm:h-52
            bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl
            cursor-pointer hover:bg-gray-100 transition-colors
          "
          title="input_area"
        >
          {/* File Input: Made invisible and sized to cover the parent div for a large click area. */}
          <input
            type="file"
            accept=".xlsx, .xls" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleFileChange}
            aria-label="Upload Excel File"
          />
          
          {/* Visual Feedback: Elements visible within the dropzone */}
          <div className="flex flex-col items-center text-center p-4">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-stone-900" />
            
            {/* Status Message (Conditional Rendering) */}
            <p className="text-sm sm:text-base font-semibold text-gray-700">
              {currentUploadName
                ? `${currentUploadName} selected.`
                : "Drag and drop your .xlsx or .xls file here, or click to browse."}
            </p>
          </div>
        </div>
        
        {/* 3. File Name Display (Confirmation line) */}
        {/* Only renders if a file name is in state. */}
        {currentUploadName && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-700">
            <FileText className="w-4 h-4 text-stone-700" />
            <span className="font-medium text-stone-900 truncate max-w-full">
              {currentUploadName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default InputFile;