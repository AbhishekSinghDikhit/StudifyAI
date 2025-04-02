import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };

  return (
    <>
      {/* Main Navbar */}
      <Paper
        elevation={6}
        sx={{
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          borderRadius: "50px",
          overflow: "hidden",
          bgcolor: "#AA60C8",
        }}
      >
        <AppBar position="static" sx={{ bgcolor: "transparent", boxShadow: "none" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Brand Name */}
            <Box display="flex" alignItems="center">
              <SchoolIcon sx={{ color: "#FFDFEF", fontSize: 32, mr: 1 }} />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "#FFDFEF",
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                  "&:hover": { color: "#EABDE6" },
                }}
              >
                StudifyAI
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                component={Link}
                to="/"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { color: "#EABDE6" },
                }}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/dashboard"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { color: "#EABDE6" },
                }}
              >
                Dashboard
              </Button>
              {user ? (
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    bgcolor: "#D69ADE",
                    borderRadius: "8px",
                    ml: 2,
                    "&:hover": { bgcolor: "#EABDE6" },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: "#AA60C8",
                    bgcolor: "white",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    ml: 2,
                    "&:hover": { bgcolor: "#EABDE6", color: "black" },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              edge="end"
              sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Paper>

      {/* Sidebar Drawer for Mobile Layout */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, bgcolor: "#AA60C8", height: "100vh", color: "white" }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/">
              <HomeIcon sx={{ color: "#FFDFEF", mr: 2 }} />
              <ListItemText primary="Home" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button component={Link} to="/dashboard">
              <DashboardIcon sx={{ color: "#FFDFEF", mr: 2 }} />
              <ListItemText primary="Dashboard" sx={{ color: "white" }} />
            </ListItem>
            {user ? (
              <ListItem button onClick={handleLogout}>
                <LogoutIcon sx={{ color: "#FFDFEF", mr: 2 }} />
                <ListItemText primary="Logout" sx={{ color: "white" }} />
              </ListItem>
            ) : (
              <ListItem button component={Link} to="/login">
                <LoginIcon sx={{ color: "#FFDFEF", mr: 2 }} />
                <ListItemText primary="Login" sx={{ color: "white" }} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
