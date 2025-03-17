import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase"; // Import Firebase auth

const QuestionForm = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionType, setQuestionType] = useState("mcq");
  const [totalMarks, setTotalMarks] = useState(10);
  const [marksPerQuestion, setMarksPerQuestion] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

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

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
    disabled: !user, // Disable dropzone if not logged in
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to generate questions.");
      return;
    }
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("pdf_file", file);
    formData.append("topic", topic);
    formData.append("difficulty", difficulty);
    formData.append("question_type", questionType);
    formData.append("total_marks", totalMarks);
    formData.append("marks_per_question", marksPerQuestion);

    try {
      const response = await axios.post("https://studifyai-9ba7.onrender.com/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.questions) {
        navigate("/question-display", { state: { questions: response.data.questions } });
      }
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-4xl font-extrabold text-white mb-6">📄 AI-Powered Question Generator</h1>

      {!user ? (
        <p className="text-white bg-red-500 px-4 py-2 rounded-md">⚠ Please log in to use this feature.</p>
      ) : (
        <>
          {/* Drag & Drop Upload Section */}
          <div 
            {...getRootProps()} 
            className={`mt-6 p-6 w-full max-w-lg text-center border-2 border-dashed rounded-lg shadow-md transition ${
              user ? "border-blue-200 bg-white hover:bg-blue-100 cursor-pointer" : "border-gray-400 bg-gray-200 cursor-not-allowed"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 font-semibold">
              {file ? `📂 ${file.name}` : "Drag & drop a PDF or click to upload"}
            </p>
          </div>

          {/* Glassmorphic Form Container */}
          <form 
            onSubmit={handleSubmit} 
            className="mt-6 bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-lg border border-white/30"
          >
            {/* Topic Input */}
            <div className="mb-4">
              <label className="block font-semibold text-white">📌 Topic:</label>
              <input 
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                required 
              />
            </div>

            {/* Difficulty Level */}
            <div className="mb-4">
              <label className="block font-semibold text-white">🎯 Difficulty Level:</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)} 
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>

            {/* Question Type */}
            <div className="mb-4">
              <label className="block font-semibold text-white">📋 Question Type:</label>
              <select 
                value={questionType} 
                onChange={(e) => setQuestionType(e.target.value)} 
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="mcq">✅ Multiple Choice (MCQ)</option>
                <option value="theory">📝 Theory</option>
              </select>
            </div>

            {/* Total Marks */}
            <div className="mb-4">
              <label className="block font-semibold text-white">🏆 Total Marks:</label>
              <input 
                type="number" 
                value={totalMarks} 
                onChange={(e) => setTotalMarks(Number(e.target.value))} 
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                required 
              />
            </div>

            {/* Marks Per Question (only for MCQs) */}
            {questionType === "mcq" && (
              <div className="mb-4">
                <label className="block font-semibold text-white">🎯 Marks Per Question:</label>
                <input 
                  type="number" 
                  value={marksPerQuestion} 
                  onChange={(e) => setMarksPerQuestion(Number(e.target.value))} 
                  className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                  required 
                />
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4 shadow-lg transition duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "⏳ Generating..." : "🚀 Generate Questions"}
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default QuestionForm;
