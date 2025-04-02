import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-in failed. Try again.");
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #AA60C8 0%, #D69ADE 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            color: "#FFDFEF",
            width: "400px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Welcome Back 👋
          </Typography>

          {error && (
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "red", mt: 2 }}
            >
              {error}
            </Typography>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleEmailLogin} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                input: { color: "black" },
                label: { color: "black" },
                "& .MuiFilledInput-root": { borderRadius: "10px" },
                "& .MuiFilledInput-underline:before": { borderBottom: "none" },
              }}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="filled"
              sx={{
                mt: 2,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                input: { color: "black" },
                label: { color: "black" },
                "& .MuiFilledInput-root": { borderRadius: "10px" },
                "& .MuiFilledInput-underline:before": { borderBottom: "none" },
              }}
              required
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: "#AA60C8",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#D69ADE" },
                }}
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
            </motion.div>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3, bgcolor: "rgba(255, 255, 255, 0.3)" }} />

          {/* Google Login */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGoogleLogin}
              sx={{
                bgcolor: "#EA4335",
                color: "white",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#D32F2F" },
              }}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
          </motion.div>

          {/* Register Option */}
          <Typography variant="body2" align="center" sx={{ mt: 3, color:"black" }}>
            Don't have an account?{" "}
            <Button
              onClick={handleRegister}
              sx={{
                color:"black",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": { textDecoration: "underline" },
              }}
              startIcon={<PersonAddIcon />}
            >
              Register
            </Button>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
