import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch profile (FIX: wrapped in useCallback)
  const fetchProfile = useCallback(async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
      logout();
    }
  }, [navigate]);

  // Fetch tasks (FIX: wrapped in useCallback)
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create task (NO CHANGE)
  const createTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await API.post("/tasks", {
        title: newTask,
      });

      setTasks([res.data, ...tasks]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task (NO CHANGE)
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Load data (FIX: dependencies added)
  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, [fetchProfile, fetchTasks]);

  // Filter tasks (NO CHANGE)
  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || "User"}
          </h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* Add Task */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6"
      >

        <div className="flex gap-2">

          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task..."
            className="flex-1 p-3 rounded-lg bg-black/40 border border-gray-700 outline-none"
          />

          <button
            onClick={createTask}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>

        </div>

      </motion.div>

      {/* Search */}
      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 mb-4 outline-none"
      />

      {/* Tasks List */}
      <div className="space-y-3">

        {loading ? (
          <p className="text-gray-400">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-400">No tasks found</p>
        ) : (
          filteredTasks.map(task => (

            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl"
            >

              <span>{task.title}</span>

              <button
                onClick={() => deleteTask(task._id)}
                className="px-3 py-1 bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>

            </motion.div>

          ))
        )}

      </div>

    </div>
  );
}

export default Dashboard;