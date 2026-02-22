import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          PrimeTrade AI
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Welcome back
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-blue-500 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-blue-500 outline-none"
            required
          />

          <button className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition">
            Login
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          No account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;