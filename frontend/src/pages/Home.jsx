import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const features = [
    {
      title: "📄 PDF Summarization",
      description: "Upload PDFs and get AI-generated summaries instantly.",
      link: "/pdf-summarization",
      bgColor: "from-blue-500 to-blue-700",
    },
    {
      title: "📝 Question Generation & Evaluation",
      description: "Generate questions from PDFs and evaluate answers using AI.",
      link: "/question-form",
      bgColor: "from-green-500 to-green-700",
    },
    {
      title: "❓ Manual Q&A",
      description: "Create and manage your own questions and answers.",
      link: "/manual-qa",
      bgColor: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-blue-600 mb-6 drop-shadow-lg"
      >
        Welcome to StudifyAI 🎓
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-lg text-gray-800 text-center max-w-2xl mb-10"
      >
        Upload your PDFs and let AI summarize them, generate questions, and evaluate your answers seamlessly.
      </motion.p>

      {/* Feature Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.6 } },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${feature.bgColor} text-white transform transition-transform`}
          >
            <h2 className="text-2xl font-semibold mb-3">{feature.title}</h2>
            <p className="mb-4">{feature.description}</p>
            <Link
              to={feature.link}
              className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Explore →
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
