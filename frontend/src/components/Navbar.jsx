import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
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

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/">
          <img src="src/assets/studify_logo.png" alt="Logo" className="h-12 w-auto" />
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          <Link to="/dashboard" className="text-white hover:text-gray-200">Dashboard</Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
