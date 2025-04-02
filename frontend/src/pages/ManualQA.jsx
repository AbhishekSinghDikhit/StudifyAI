import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { auth } from "../firebase"; 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ManualQA = () => {
  const [user, setUser] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [wordLimit, setWordLimit] = useState(50);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();
  const answerRef = useRef(null);

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

  const handleFileChange = (e) => setPdfFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to submit a question.");
      return;
    }

    if (!pdfFile || !question.trim() || !wordLimit) {
      setError("Please upload a PDF, enter a question, and specify a word limit.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer("");
    setCopySuccess(false);

    const formData = new FormData();
    formData.append("pdf_file", pdfFile);
    formData.append("question", question);
    formData.append("word_limit", wordLimit);

    try {
      const response = await axios.post("https://backend-service-278839010965.us-central1.run.app/askQuestion", formData);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setError("Failed to retrieve the answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (answer) {
      navigator.clipboard.writeText(answer);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#AA60C8] to-[#FFDFEF] p-6">
    {/* Push content down so it's always below the navbar */}
     <div className="mt-20 w-full flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white bg-opacity-30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-xl w-full"
      >
        <h1 className="text-3xl font-bold text-center text-black mb-4">📘 Manual Q&A</h1>
        <p className="text-lg text-gray-900 text-center mb-6">
          Upload a PDF and ask a question to get an AI-generated answer.
        </p>

        {/* Authentication Check */}
        {!user ? (
          <p className="text-red-600 text-center font-semibold">🔒 Please log in to use this feature.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PDF Upload */}
            <label className="block text-black font-semibold">📄 Upload PDF:</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-[#AA60C8] bg-white"
            />

            {/* Question Input */}
            <label className="block text-black font-semibold">❓ Ask a Question:</label>
            <textarea
              rows="3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-[#AA60C8] bg-white"
              placeholder="Type your question here..."
            />

            {/* Word Limit */}
            <label className="block text-black font-semibold">✏ Word Limit:</label>
            <input
              type="number"
              value={wordLimit}
              onChange={(e) => setWordLimit(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-[#AA60C8] bg-white"
              min="10"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#AA60C8] to-[#8A45A3] text-white font-semibold p-2 rounded-lg shadow-md hover:from-[#8A45A3] hover:to-[#6C2F91] transition-all duration-300"
              disabled={!user}
            >
              {loading ? "Processing..." : "Get Answer"}
            </button>
          </form>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-4">
            <CircularProgress size={32} sx={{ color: "#AA60C8" }} />
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mt-4 text-red-600 text-center font-semibold">{error}</p>}

        {/* Answer Display */}
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 bg-white bg-opacity-60 p-4 rounded-xl text-black max-h-60 overflow-y-auto"
            ref={answerRef}
          >
            <h2 className="text-lg font-semibold text-[#AA60C8] mb-2">📌 AI-Generated Answer:</h2>
            <p className="text-base">{answer}</p>
          </motion.div>
        )}

        {/* Copy Button Below Answer */}
        {answer && (
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
  </div>
  );
};

export default ManualQA;
