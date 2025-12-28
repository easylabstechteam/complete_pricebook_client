import * as xlsx from "xlsx";

export interface ExcelRow {
  [key: string]: any;
}

export interface ProcessResponse {
  success: ExcelRow[] | null;
  error: { title: string; message: string; code: number } | null;
}

const REQUIRED_HEADERS = [
  "Supplier Name", "Trade Code", "Brand", "Product Name", "Description",
  "Code", "Price", "Unit", "Effective Date", "Update Date", "Storage",
  "Haz", "Grade", "Type", "Compliance", "L", "W", "T", "Weight Unit"
];

async function processExcelFile(file: File): Promise<ProcessResponse> {
  const fileName = file.name.toLowerCase();

  if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
    return {
      success: null,
      error: { title: "Invalid File", message: "Please upload an Excel file (.xlsx or .xls)", code: 400 },
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = xlsx.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    
    if (!firstSheetName) {
      throw new Error("The excel file is empty.");
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const worksheetData = xlsx.utils.sheet_to_json(worksheet) as ExcelRow[];

    if (worksheetData.length === 0) {
      return { success: null, error: { title: "Empty File", message: "No data found in sheet", code: 400 } };
    }

    // Header Validation
    const fileHeaders = Object.keys(worksheetData[0]).map(h => h.toLowerCase().trim().replace(/\s+/g, ' '));
    const missing = REQUIRED_HEADERS.filter(h => !fileHeaders.includes(h.toLowerCase().trim().replace(/\s+/g, ' ')));

    if (missing.length > 0) {
      return {
        success: null,
        error: {
          title: "Missing Columns",
          message: `Missing: ${missing.join(", ")}`,
          code: 422,
        },
      };
    }

    return { success: worksheetData, error: null };
  } catch (err) {
    return {
      success: null,
      error: { title: "Processing Error", message: "Failed to read file content", code: 500 },
    };
  }
}

export default processExcelFile;