import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const PdfSummarization = () => {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();
  const summaryRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const onDrop = async (acceptedFiles) => {
    if (!user) {
      setError("You must be logged in to upload a PDF.");
      return;
    }

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("pdfFile", file);

    setLoading(true);
    setError(null);
    setSummary(null);
    setCopySuccess(false);

    try {
      const response = await fetch("https://backend-service-278839010965.us-central1.run.app/summarize-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.summary) {
        setSummary(data.summary);
      } else {
        throw new Error("Invalid response format from backend.");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "application/pdf",
    disabled: !user,
  });

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#AA60C8] to-[#FFDFEF] p-6">
      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white bg-opacity-30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-xl w-full"
      >
        <h1 className="text-3xl font-bold text-center text-black mb-4">📄 PDF Summarization</h1>
        <p className="text-lg text-gray-900 text-center mb-6">
          Upload a PDF and get an AI-generated summary.
        </p>

        {/* Authentication Check */}
        {!user ? (
          <p className="text-red-600 text-center font-semibold">🔒 Please log in to use this feature.</p>
        ) : (
          <motion.div
            {...getRootProps()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`border-2 border-black border-dashed p-10 rounded-lg cursor-pointer transition flex flex-col items-center ${
              user
                ? "bg-white bg-opacity-40 hover:bg-opacity-50"
                : "border-gray-500 cursor-not-allowed"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-black text-center font-semibold">
              Drag & drop a PDF file here, or <span className="text-[#AA60C8] underline">click to select one</span>.
            </p>
          </motion.div>
        )}

        {/* Status Messages */}
        {loading && (
          <div className="flex justify-center mt-4">
            <CircularProgress size={32} sx={{ color: "#AA60C8" }} />
          </div>
        )}
        {error && <p className="mt-4 text-red-600 text-center font-semibold">{error}</p>}

        {/* Summary Display */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 bg-white bg-opacity-60 p-4 rounded-xl text-black max-h-60 overflow-y-auto"
            ref={summaryRef}
          >
            <h2 className="text-lg font-semibold text-[#AA60C8] mb-2">📌 AI-Generated Summary:</h2>
            <p className="text-base">{summary}</p>
          </motion.div>
        )}

        {/* Copy Button Below Summary */}
        {summary && (
          <div className="flex justify-end mt-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-[#AA60C8] text-white rounded-lg text-sm font-semibold shadow-md hover:bg-[#8A45A3] transition"
            >
              <ContentCopyIcon fontSize="small" />
              {copySuccess ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PdfSummarization;
