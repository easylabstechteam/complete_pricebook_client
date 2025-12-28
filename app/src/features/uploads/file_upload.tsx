import processExcelFile from "@/services/upload/processExcelFile";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useGlobalErrorState } from "@/store/useErrorState";

interface InputFileProps {
  onUploadSuccess: (data: any[]) => void;
  isMinimized?: boolean; // Prop to change styling when data is loaded
}

function InputFile({ onUploadSuccess, isMinimized }: InputFileProps) {
  const [currentUploadName, setCurrentUploadName] = useState<string | null>(
    null
  );
  const setError = useGlobalErrorState((state: any) => state.setError);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setCurrentUploadName(file.name);

    const { success, error } = await processExcelFile(file);

    setLoading(false);
    if (error) {
      setError({
        title: error.title,
        message: error.message,
        code: error.code,
      });
      setCurrentUploadName(null);
    } else if (success) {
      onUploadSuccess(success);
    }
  };

  return (
    <div
      className={`mx-auto transition-all duration-500 ${
        isMinimized ? "w-full px-4" : "max-w-2xl"
      }`}
    >
      <div
        className={`
        bg-white rounded-2xl border border-stone-300 shadow-md transition-all 
        ${isMinimized ? "p-2 flex items-center" : "p-10 text-center"}
      `}
      >
        {!isMinimized && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-900">
              Upload Data File
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Accepts .xlsx and .xls formats.
            </p>
          </div>
        )}

        <div
          className={`
          relative flex items-center justify-center border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-all
          ${isMinimized ? "h-12 w-full" : "h-48 flex-col"}
        `}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            onChange={handleFileChange}
          />

          <div
            className={`flex items-center space-x-3 ${
              isMinimized ? "flex-row" : "flex-col space-y-2"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-blue-600" />
            ) : (
              <Upload
                className={`${
                  isMinimized ? "w-5 h-5" : "w-10 h-10"
                } text-stone-400`}
              />
            )}
            <p className="text-sm font-medium text-stone-600">
              {currentUploadName ? currentUploadName : "Upload new file..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export { InputFile };
