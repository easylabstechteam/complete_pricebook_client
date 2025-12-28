interface ErrorData {
  title?: string;
  message: string;
  code?: string | number;
}

interface ErrorCardProps {
  activeError?: ErrorData | null;
  setError?: (error: ErrorData) => void; // Provided if you need to update it
  clearError?: () => void;
}

export type {ErrorCardProps}