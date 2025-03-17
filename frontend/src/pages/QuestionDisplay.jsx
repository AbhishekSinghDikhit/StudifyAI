import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const QuestionDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions || [];

  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, missed: 0 });

  // Handle Answer Selection
  const handleAnswerChange = (questionIndex, selectedOption) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: selectedOption });
  };

  // Submit Test
  const handleSubmit = () => {
    let correct = 0, incorrect = 0, missed = 0;

    questions.forEach((q, index) => {
      if (!userAnswers.hasOwnProperty(index)) {
        missed++;
      } else if (q.options && userAnswers[index] === q.correctAnswer) {
        correct++;
      } else if (q.options) {
        incorrect++;
      }
    });

    setScore({ correct, incorrect, missed });
    setSubmitted(true);
  };

  // Export PDF
  const exportPDF = (includeAnswers) => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica");
    pdf.setFontSize(14);

    pdf.text("Generated Questions", 10, 10);

    let yOffset = 20;
    const pageWidth = 180;
    const pageHeight = 270;

    questions.forEach((q, index) => {
      if (yOffset > pageHeight) {
        pdf.addPage();
        yOffset = 20;
      }

      const questionLines = pdf.splitTextToSize(`${index + 1}. ${q.question}`, pageWidth);
      pdf.text(questionLines, 10, yOffset);
      yOffset += questionLines.length * 6;

      if (q.options) {
        Object.entries(q.options).forEach(([key, option]) => {
          if (yOffset > pageHeight) {
            pdf.addPage();
            yOffset = 20;
          }

          const optionLines = pdf.splitTextToSize(`${key}. ${option}`, pageWidth);
          pdf.text(optionLines, 15, yOffset);
          yOffset += optionLines.length * 6;
        });
      } else {
        pdf.setFont("helvetica", "italic");
        pdf.text("Write your answer below:", 10, yOffset);
        pdf.setFont("helvetica", "normal");
        yOffset += 8;

        for (let i = 0; i < 5; i++) {
          pdf.text("__________________________________________", 10, yOffset);
          yOffset += 8;
        }
      }

      if (includeAnswers && q.correctAnswer) {
        if (yOffset > pageHeight) {
          pdf.addPage();
          yOffset = 20;
        }

        pdf.setFont("helvetica", "bold");
        pdf.text("Correct Answer:", 10, yOffset);
        pdf.setFont("helvetica", "normal");
        yOffset += 8;

        const answerLines = pdf.splitTextToSize(q.correctAnswer, pageWidth);
        answerLines.forEach((line) => {
          if (yOffset > pageHeight) {
            pdf.addPage();
            yOffset = 20;
          }
          pdf.text(line, 10, yOffset);
          yOffset += 6;
        });
      }

      yOffset += 10;
    });

    pdf.save(includeAnswers ? "questions_with_answers.pdf" : "questions_only.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-700">Take the Test</h1>

      {questions.length > 0 ? (
        <div className="mt-6 w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          {questions.map((q, index) => (
            <div key={index} className="mt-4 p-5 border rounded-lg bg-gray-100 shadow-sm">
              <p className="text-lg font-semibold text-gray-800">{q.question}</p>
              {q.marks && <p className="text-sm text-gray-600">Marks: {q.marks}</p>}

              <div className="mt-3">
                {q.options ? (
                  Object.entries(q.options).map(([key, option]) => (
                    <label
                      key={key}
                      className="block p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-100"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={key}
                        onChange={() => handleAnswerChange(index, key)}
                        disabled={submitted}
                        className="mr-2"
                      />
                      {key}. {option}
                    </label>
                  ))
                ) : (
                  <textarea
                    rows="4"
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                    placeholder="Type your answer here..."
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    disabled={submitted}
                  />
                )}
              </div>

              {submitted && q.options && (
                <p
                  className={`mt-2 font-semibold ${
                    userAnswers[index] === q.correctAnswer ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Correct Answer: {q.correctAnswer}
                </p>
              )}

              {submitted && !q.options && (
                <p className="mt-2 text-blue-600 font-semibold">Your answer has been submitted.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-600">No questions found. Please try again.</p>
      )}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-all"
        >
          Submit Test
        </button>
      ) : (
        <div className="mt-6 p-5 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-xl font-bold text-blue-700">Test Results</h2>
          <p className="text-green-600">✔ Correct: {score.correct}</p>
          <p className="text-red-600">❌ Incorrect: {score.incorrect}</p>
          <p className="text-gray-600">⏳ Missed: {score.missed}</p>
        </div>
      )}

      {/* Export Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => exportPDF(false)}
          className="bg-gray-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all"
        >
          Export Questions 📄
        </button>
        <button
          onClick={() => exportPDF(true)}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
        >
          Export with Answers ✅
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-700 transition-all"
      >
        Back to Home
      </button>
    </div>
  );
};

export default QuestionDisplay;
