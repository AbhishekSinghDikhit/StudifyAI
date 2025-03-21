import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PdfSummarization from "./pages/PdfSummarization";
import ManualQA from "./pages/ManualQA";
import QuestionForm from "./pages/QuestionForm";
import QuestionDisplay from "./pages/QuestionDisplay";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pdf-summarization" element={<PdfSummarization />} />
          <Route path="/manual-qa" element={<ManualQA />} />
          <Route path="/question-form" element={<QuestionForm />} />
          <Route path="/question-display" element={<QuestionDisplay />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
