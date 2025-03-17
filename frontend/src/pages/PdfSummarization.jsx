import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { auth } from "../firebase"; // Import Firebase auth
import { useNavigate } from "react-router-dom"; // Redirect unauthenticated users
import { motion } from "framer-motion"; // Smooth Animations

const PdfSummarization = () => {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Navigation hook

  // 🔹 Check user authentication on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        navigate("/login"); // Redirect to login page if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup
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

    try {
      const response = await fetch("{https://backend-service-278839010965.us-central1.run.app}/summarize-pdf", {
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
    disabled: !user, // Disable dropzone if not logged in
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-xl w-full text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-4">📄 PDF Summarization</h1>
        <p className="text-lg text-gray-200 text-center mb-6">
          Upload a PDF and get an AI-generated summary.
        </p>

        {!user ? (
          <p className="text-red-300 text-center">Please log in to use this feature.</p>
        ) : (
          <motion.div
            {...getRootProps()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`border-2 border-dashed p-10 rounded-lg cursor-pointer transition ${
              user ? "border-blue-400 bg-white bg-opacity-20 hover:bg-opacity-30" : "border-gray-400 cursor-not-allowed"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-100 text-center">
              Drag & drop a PDF file here, or <span className="text-blue-300 underline">click to select one</span>.
            </p>
          </motion.div>
        )}

        {/* Status Messages */}
        {loading && <p className="mt-4 text-blue-300 text-center">Processing your PDF...</p>}
        {error && <p className="mt-4 text-red-300 text-center">{error}</p>}

        {/* Summary Display */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 bg-white bg-opacity-30 p-4 rounded-xl text-gray-200"
          >
            <h2 className="text-lg font-semibold text-blue-300 mb-2">📌 AI-Generated Summary:</h2>
            <p className="text-base">{summary}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PdfSummarization;
