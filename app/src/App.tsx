
import { Routes, Route } from "react-router-dom";
import SearchPage from "@/pages/search";
import AnalyticsPage from "@/pages/analytics";
import UploadPage from "@/pages/upload";

function App() {
  return (
    <Routes>
      <Route path="" element={<SearchPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="*" element={<p> nah we don't do that here</p>} />
    </Routes>
  );
}

export default App;
