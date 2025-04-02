import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Typography, Paper, Box, Avatar, Grid, Container } from "@mui/material";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pdfCount, setPdfCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [recentTestScore, setRecentTestScore] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const pdfQuery = query(collection(db, "pdfs"), where("userId", "==", userId));
      const pdfSnapshot = await getDocs(pdfQuery);
      setPdfCount(pdfSnapshot.size);

      const questionQuery = query(collection(db, "questions"), where("userId", "==", userId));
      const questionSnapshot = await getDocs(questionQuery);
      setQuestionCount(questionSnapshot.size);

      const testQuery = query(collection(db, "testScores"), where("userId", "==", userId));
      const testSnapshot = await getDocs(testQuery);
      if (!testSnapshot.empty) {
        const lastTest = testSnapshot.docs[testSnapshot.docs.length - 1].data();
        setRecentTestScore(lastTest.score);
        setAccuracy(lastTest.accuracy);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000", // Matte Black Background
        color: "#FFDFEF", // Pale Pink Text
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: { xs: "80px", md: "100px" }, // Space below navbar
      }}
    >
      <Container maxWidth="md">
        {user ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Paper
              elevation={6}
              sx={{
                padding: 4,
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.1)", // Glassmorphism effect
                backdropFilter: "blur(10px)",
                textAlign: "center",
              }}
            >
              {/* Profile Section */}
              <Avatar
                src={user.photoURL || "https://via.placeholder.com/150"}
                sx={{
                  width: 80,
                  height: 80,
                  margin: "0 auto",
                  border: "2px solid #AA60C8",
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#D69ADE", mt: 2 }}>
                Welcome, {user.displayName || "User"}!
              </Typography>
              <Typography variant="body1" sx={{ color: "#EABDE6" }}>
                {user.email}
              </Typography>

              {/* Stats Grid */}
              <Grid container spacing={3} sx={{ mt: 4 }}>
                {/* PDF Count */}
                <Grid item xs={12} sm={6}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Paper
                      sx={{
                        padding: 3,
                        borderRadius: "10px",
                        textAlign: "center",
                        bgcolor: "rgba(170, 96, 200, 0.2)",
                        color: "#AA60C8",
                        fontWeight: "bold",
                      }}
                    >
                      <Typography variant="h6">Total PDFs</Typography>
                      <Typography variant="h4">{pdfCount}</Typography>
                    </Paper>
                  </motion.div>
                </Grid>

                {/* Question Count */}
                <Grid item xs={12} sm={6}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Paper
                      sx={{
                        padding: 3,
                        borderRadius: "10px",
                        textAlign: "center",
                        bgcolor: "rgba(214, 154, 222, 0.2)",
                        color: "#D69ADE",
                        fontWeight: "bold",
                      }}
                    >
                      <Typography variant="h6">Total Questions</Typography>
                      <Typography variant="h4">{questionCount}</Typography>
                    </Paper>
                  </motion.div>
                </Grid>

                {/* Recent Test Score */}
                <Grid item xs={12} sm={6}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Paper
                      sx={{
                        padding: 3,
                        borderRadius: "10px",
                        textAlign: "center",
                        bgcolor: "rgba(234, 189, 230, 0.2)",
                        color: "#EABDE6",
                        fontWeight: "bold",
                      }}
                    >
                      <Typography variant="h6">Recent Test Score</Typography>
                      <Typography variant="h4">{recentTestScore !== null ? recentTestScore : "N/A"}</Typography>
                    </Paper>
                  </motion.div>
                </Grid>

                {/* Accuracy */}
                <Grid item xs={12} sm={6}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Paper
                      sx={{
                        padding: 3,
                        borderRadius: "10px",
                        textAlign: "center",
                        bgcolor: "rgba(255, 223, 239, 0.2)",
                        color: "#FFDFEF",
                        fontWeight: "bold",
                      }}
                    >
                      <Typography variant="h6">Accuracy</Typography>
                      <Typography variant="h4">{accuracy}%</Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>

              {/* Logout Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  fullWidth
                  onClick={handleLogout}
                  sx={{
                    mt: 4,
                    bgcolor: "#AA60C8",
                    color: "white",
                    fontWeight: "bold",
                    padding: "10px",
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#D69ADE" },
                  }}
                >
                  Logout
                </Button>
              </motion.div>
            </Paper>
          </motion.div>
        ) : (
          <Paper sx={{ padding: 6, borderRadius: "20px", textAlign: "center", bgcolor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)" }}>
            <Typography variant="h5" sx={{ color: "red" }}>Please sign in to access your dashboard.</Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
