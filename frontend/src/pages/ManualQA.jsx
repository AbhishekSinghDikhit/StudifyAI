import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase"; // Firebase auth
import { useNavigate } from "react-router-dom"; // Redirect unauthenticated users

const ManualQA = () => {
  const [user, setUser] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [wordLimit, setWordLimit] = useState(50);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔹 Check authentication on mount
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

  // Handle PDF Upload
  const handleFileChange = (e) => setPdfFile(e.target.files[0]);

  // Handle Form Submission
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

    const formData = new FormData();
    formData.append("pdf_file", pdfFile);
    formData.append("question", question);
    formData.append("word_limit", wordLimit);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_PUBLIC_URL}/askQuestion`, formData);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setError("Failed to retrieve the answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-md">📘 ManualQA Tool</h1>

      {!user ? (
        <p className="text-white bg-red-600 px-4 py-2 rounded-lg shadow-lg">⚠ Please log in to use this feature.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white/30 backdrop-blur-lg p-6 rounded-lg shadow-2xl w-full max-w-md border border-white/20"
        >
          {/* 📄 Upload PDF */}
          <label className="block text-white font-semibold mb-2">📄 Upload PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 bg-white/50"
          />

          {/* ❓ Ask a Question */}
          <label className="block text-white font-semibold mt-4 mb-2">❓ Ask a Question:</label>
          <textarea
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 bg-white/50"
            placeholder="Type your question here..."
          />

          {/* ✏ Word Limit */}
          <label className="block text-white font-semibold mt-4 mb-2">✏ Word Limit:</label>
          <input
            type="number"
            value={wordLimit}
            onChange={(e) => setWordLimit(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 bg-white/50"
            min="10"
          />

          {/* 🚀 Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold p-2 rounded-lg mt-4 shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300"
            disabled={!user}
          >
            {loading ? "Processing..." : "Get Answer"}
          </button>
        </form>
      )}

      {/* 🔄 Loading State */}
      {loading && <div className="mt-4 text-white animate-pulse">⏳ Processing your request...</div>}
      
      {/* ⚠ Error Message */}
      {error && <p className="mt-4 text-red-500 font-semibold bg-white/80 p-2 rounded-lg shadow">{error}</p>}

      {/* ✅ Display Answer */}
      {answer && (
        <div className="mt-6 p-6 bg-white/30 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-md border border-white/20">
          <h2 className="text-lg font-bold text-green-500">✅ Answer:</h2>
          <p className="mt-2 text-gray-900 font-medium">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ManualQA;
