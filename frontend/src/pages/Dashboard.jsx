import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Ensure correct Firebase import
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth"; // Import signOut function
import { useNavigate } from "react-router-dom"; // To redirect after logout

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pdfCount, setPdfCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [recentTestScore, setRecentTestScore] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Get the authenticated user
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  const fetchUserData = async (userId) => {
    try {
      // Fetch PDF uploads count
      const pdfQuery = query(collection(db, "pdfs"), where("userId", "==", userId));
      const pdfSnapshot = await getDocs(pdfQuery);
      setPdfCount(pdfSnapshot.size);

      // Fetch question generation count
      const questionQuery = query(collection(db, "questions"), where("userId", "==", userId));
      const questionSnapshot = await getDocs(questionQuery);
      setQuestionCount(questionSnapshot.size);

      // Fetch recent test score
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

  // 🔹 Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {user ? (
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
          {/* Profile Section */}
          <div className="flex items-center mb-6">
            <img
              src={user.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-blue-500"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome, {user.displayName || "User"}!
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* PDF Count */}
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-blue-700">Total PDFs Uploaded</h2>
              <p className="text-2xl font-bold text-blue-900">{pdfCount}</p>
            </div>

            {/* Question Count */}
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-green-700">Total Questions Generated</h2>
              <p className="text-2xl font-bold text-green-900">{questionCount}</p>
            </div>

            {/* Test Score */}
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-yellow-700">Recent Test Score</h2>
              <p className="text-2xl font-bold text-yellow-900">
                {recentTestScore !== null ? recentTestScore : "N/A"}
              </p>
            </div>

            {/* Accuracy */}
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-red-700">Accuracy</h2>
              <p className="text-2xl font-bold text-red-900">{accuracy}%</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">Please sign in to access your dashboard.</h2>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
