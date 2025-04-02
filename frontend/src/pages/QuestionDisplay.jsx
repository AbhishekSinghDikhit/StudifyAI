import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Paper,
  Stack,
} from "@mui/material";

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
    let correct = 0,
      incorrect = 0,
      missed = 0;

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

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#141414", p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h3" fontWeight="bold" color="#EABDE6" sx={{ mb: 3 }}>
        📖 Take the Test
      </Typography>

      {questions.length > 0 ? (
        <Paper sx={{ width: "100%", maxWidth: 800, p: 4, borderRadius: 3, backgroundColor: "#1F1F1F", boxShadow: 5 }}>
          {questions.map((q, index) => (
            <Card key={index} sx={{ mb: 3, backgroundColor: "#292929", color: "white", p: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="#D69ADE">
                  {q.question}
                </Typography>
                {q.marks && (
                  <Typography variant="body2" color="gray">
                    🏆 Marks: {q.marks}
                  </Typography>
                )}

                <Box mt={2}>
                  {q.options ? (
                    <FormControl component="fieldset">
                      <RadioGroup
                        name={`question-${index}`}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        value={userAnswers[index] || ""}
                      >
                        {Object.entries(q.options).map(([key, option]) => {
                          let backgroundColor = "transparent";
                          let textColor = "white";

                          if (submitted) {
                            if (userAnswers[index] === key) {
                              backgroundColor = userAnswers[index] === q.correctAnswer ? "green" : "red";
                              textColor = "white";
                            } else if (key === q.correctAnswer) {
                              backgroundColor = "green";
                              textColor = "white";
                            }
                          }

                          return (
                            <FormControlLabel
                              key={key}
                              value={key}
                              control={<Radio sx={{ color: submitted ? textColor : "#D69ADE" }} />}
                              label={`${key}. ${option}`}
                              sx={{
                                backgroundColor,
                                borderRadius: 2,
                                p: 1,
                                color: textColor,
                                "&:hover": { backgroundColor: "#D69ADE", color: "black" },
                              }}
                              disabled={submitted}
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      placeholder="Type your answer here..."
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={submitted}
                      sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                  )}
                </Box>

                {/* Feedback after submission */}
                {submitted && q.options && (
                  <Box mt={2}>
                    {userAnswers[index] === q.correctAnswer ? (
                      <Typography fontWeight="bold" color="green">
                        ✅ Your answer is correct!
                      </Typography>
                    ) : (
                      <Typography fontWeight="bold" color="red">
                        ❌ Your answer is incorrect.
                      </Typography>
                    )}
                    <Typography fontWeight="bold" color="green">
                      ✅ The correct answer is: {q.correctAnswer}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Paper>
      ) : (
        <Typography mt={3} color="#EABDE6">
          ❌ No questions found. Please try again.
        </Typography>
      )}

      {!submitted ? (
        <Button variant="contained" sx={{ mt: 4, backgroundColor: "#AA60C8", "&:hover": { backgroundColor: "#8A49A3" } }} onClick={handleSubmit}>
          🚀 Submit Test
        </Button>
      ) : (
        <Paper sx={{ mt: 4, p: 3, borderRadius: 2, backgroundColor: "#292929", color: "white", textAlign: "center" }}>
          <Typography variant="h6" color="#EABDE6">
            📊 Test Results
          </Typography>
          <Typography color="green">✔ Correct: {score.correct}</Typography>
          <Typography color="red">❌ Incorrect: {score.incorrect}</Typography>
          <Typography color="gray">⏳ Missed: {score.missed}</Typography>
        </Paper>
      )}

      <Stack direction="row" spacing={2} mt={4}>
        <Button variant="contained" color="secondary">
          📄 Export Questions
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#AA60C8", "&:hover": { backgroundColor: "#8A49A3" } }}>
          ✅ Export with Answers
        </Button>
      </Stack>

      <Button sx={{ mt: 3, color: "white", backgroundColor: "gray", "&:hover": { backgroundColor: "#555" } }} onClick={() => navigate("/")}>
        🔙 Back to Home
      </Button>
    </Box>
  );
};

export default QuestionDisplay;
