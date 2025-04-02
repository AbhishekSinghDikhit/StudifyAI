import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase"; // Import Firebase auth
import { motion } from "framer-motion";

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
      const response = await axios.post("https://backend-service-278839010965.us-central1.run.app/analyze", formData, {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#AA60C8] to-[#FFDFEF] p-6">
      {/* Ensuring Navbar spacing */}
      <div className="mt-24 w-full flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white bg-opacity-30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-xl w-full"
        >
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-black mb-4">📄 AI-Powered Question Generator</h1>
          <p className="text-lg text-gray-900 text-center mb-6">
            Upload a PDF and let AI generate tailored questions for you!
          </p>

          {!user ? (
            <p className="text-red-500 bg-white/20 px-4 py-2 rounded-md text-center shadow-md">
              ⚠ Please log in to use this feature.
            </p>
          ) : (
            <>
              {/* Drag & Drop Upload Section */}
              <div
                {...getRootProps()}
                className={`p-6 w-full text-center border-2 border-dashed rounded-lg shadow-md transition ${
                  user
                    ? "border-gray-500 bg-gray-300 text-gray-900 hover:bg-gray-400 cursor-pointer"
                    : "border-gray-600 bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                <input {...getInputProps()} />
                <p className="font-semibold">{file ? `📂 ${file.name}` : "Drag & drop a PDF or click to upload"}</p>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="mt-6 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-gray-600">
                {/* Topic Input */}
                <div className="mb-4">
                  <label className="block font-semibold text-[#532b58]">📌 Topic:</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-300 text-black focus:ring-2 focus:ring-[#000000] transition"
                    required
                  />
                </div>

                {/* Difficulty Level */}
                <div className="mb-4">
                  <label className="block font-semibold text-[#532b58]">🎯 Difficulty Level:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-300 text-black focus:ring-2 focus:ring-[#D69ADE] transition"
                  >
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </select>
                </div>

                {/* Question Type */}
                <div className="mb-4">
                  <label className="block font-semibold text-[#532b58]">📋 Question Type:</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-300 text-black focus:ring-2 focus:ring-[#D69ADE] transition"
                  >
                    <option value="mcq">✅ Multiple Choice (MCQ)</option>
                    <option value="theory">📝 Theory</option>
                  </select>
                </div>

                {/* Total Marks */}
                <div className="mb-4">
                  <label className="block font-semibold text-[#532b58]">🏆 Total Marks:</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg bg-gray-300 text-black focus:ring-2 focus:ring-[#D69ADE] transition"
                    required
                  />
                </div>

                {/* Marks Per Question (only for MCQs) */}
                {questionType === "mcq" && (
                  <div className="mb-4">
                    <label className="block font-semibold text-[#532b58]">🎯 Marks Per Question:</label>
                    <input
                      type="number"
                      value={marksPerQuestion}
                      onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg bg-gray-300 text-black focus:ring-2 focus:ring-[#D69ADE] transition"
                      required
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#AA60C8] hover:bg-[#8a49a3] text-white font-semibold py-2 rounded-lg mt-4 shadow-lg transition duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "⏳ Generating..." : "🚀 Generate Questions"}
                </button>

                {/* Error Message */}
                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionForm;
