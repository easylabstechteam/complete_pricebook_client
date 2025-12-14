import * as xlsx from "xlsx";

/**
 * Reads an Excel file (.xlsx or .xls) from a file input change event,
 * converts the first sheet's data into a JSON array, and returns it.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from a file input.
 * @returns {Promise<Array<any> | null>} A promise that resolves to an array of objects
 * representing the sheet data, or null on failure.
 */
async function processExcelFile(
  e: React.ChangeEvent<HTMLInputElement>
): Promise<Array<any> | null> {
  // 1. Basic Input and File Validation
  const file = e.target.files?.[0];

  if (!file) {
    // No file selected
    return null;
  }

  const fileName = file.name.toLowerCase();
  
  if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
    // Log the error for internal use, but the function returns null
    console.error("File type error: Only .xlsx and .xls files are accepted.");
    // In a real app, you would typically dispatch a user notification here.
    return null;
  }

  try {
    // 2. Read File as ArrayBuffer (Raw Binary Data)
    const arrayBuffer = await file.arrayBuffer();
    
    // 3. Process the ArrayBuffer using xlsx.read()
    // { type: 'buffer' } option ensures proper reading of the binary ArrayBuffer.
    const workbook = xlsx.read(arrayBuffer, { type: 'array' });

    // 4. Extract data from the first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
        console.error("Workbook contains no sheets.");
        return null;
    }; 
    
    const worksheet = workbook.Sheets[firstSheetName];
    
    // 5. Convert sheet data to a standard array of JavaScript objects (JSON)
    const data = xlsx.utils.sheet_to_json(worksheet);
    console.log({message:'here is the data', Data:data})

    // 6. Return the clean data array
    return data;

  } catch (error) {
    console.error("Error processing Excel file:", error);
    // Return null or re-throw a specific error object if the calling function needs to handle it.
    return null;
  }
}

export default processExcelFile;
