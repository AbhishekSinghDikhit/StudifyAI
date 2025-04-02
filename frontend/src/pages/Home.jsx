import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography, Card, CardContent, Button, Container, Grid } from "@mui/material";
import Navbar from "/src/components/Navbar.jsx"; 

const Home = () => {
  const features = [
    {
      title: "📄 PDF Summarization",
      description: "Upload PDFs and get AI-generated summaries instantly.",
      link: "/pdf-summarization",
      bgColor: "rgba(170, 96, 200, 0.4)",
      shadowColor: "rgba(170, 96, 200, 0.3)",
    },
    {
      title: "📝 Question Generation & Evaluation",
      description: "Generate questions from PDFs and evaluate answers using AI.",
      link: "/question-form",
      bgColor: "rgba(214, 154, 222, 0.4)",
      shadowColor: "rgba(214, 154, 222, 0.3)",
    },
    {
      title: "❓ Manual Q&A",
      description: "Create and manage your own questions and answers.",
      link: "/manual-qa",
      bgColor: "rgba(234, 189, 230, 0.4)",
      shadowColor: "rgba(234, 189, 230, 0.3)",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#1A1A1A",
        color: "white",
        px: 2,
        py: 6,
      }}
    >
      {/* Navbar at the top */}
      <Navbar />

      {/* Welcome Message BELOW Navbar */}
      <Box sx={{ mt: 4, textAlign: "center" }}> {/* Added margin-top to push it down */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: "#D69ADE", mb: 2 }}
          >
            Welcome to StudifyAI 🎓
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <Typography variant="h6" color="white" maxWidth="md">
            Upload your PDFs and let AI summarize them, generate questions, and evaluate your answers seamlessly.
          </Typography>
        </motion.div>
      </Box>

      {/* Feature Cards */}
      <Grid container spacing={4} justifyContent="center" mt={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Card
                sx={{
                  bgcolor: feature.bgColor,
                  color: "white",
                  boxShadow: `0px 5px 15px ${feature.shadowColor}`,
                  borderRadius: 4,
                  width: 300,
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.03)", boxShadow: `0px 8px 20px ${feature.shadowColor}` },
                }}
              >
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {feature.description}
                  </Typography>
                  <Button
                    component={Link}
                    to={feature.link}
                    variant="contained"
                    sx={{
                      bgcolor: "white",
                      color: "#AA60C8",
                      fontWeight: "bold",
                      borderRadius: "12px",
                      transition: "0.3s",
                      "&:hover": { bgcolor: "#D69ADE", color: "white", transform: "scale(1.05)" },
                    }}
                  >
                    Explore →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
