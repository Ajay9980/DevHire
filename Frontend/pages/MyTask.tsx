import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import gsap from "gsap";  
import { useGSAP } from '@gsap/react'; 

 

interface Task {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string; 
  client: {
    name: string;
    email: string; 
  };
}

function MyTask() {
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);  
  const navigate = useNavigate();

   
  useGSAP(() => {
    gsap.fromTo(
      ".my-tasks-container",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.3 }
    );
    gsap.fromTo(
      ".welcome-title",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
    );
  }, [loading]); 

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for children
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        // type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Function to determine status badge styling (consistent with Dashboard)
  const getStatusStyle = (status: string) => {
    const base = "text-sm font-bold px-3 py-1 rounded-full shadow-md";
    switch (status) {
      case 'OPEN': return `${base} bg-blue-500/20 text-blue-300 border border-blue-400`;
      case 'IN_PROGRESS': return `${base} bg-yellow-500/20 text-yellow-300 border border-yellow-400`;
      case 'COMPLETED': return `${base} bg-green-500/20 text-green-300 border border-green-400`;
      case 'PENDING': return `${base} bg-yellow-500/20 text-yellow-300 border border-yellow-400`;
      case 'REJECTED': return `${base} bg-red-500/20 text-red-300 border border-red-400`;
      case 'ACCEPTED': return `${base} bg-green-500/20 text-green-300 border border-green-400`;
      case 'SUBMITTED': return `${base} bg-purple-500/20 text-purple-300 border border-purple-400`;
      default: return `${base} bg-gray-500/20 text-gray-300 border border-gray-400`;
    }
  };


  async function getUserTask() {
    setLoading(true);
    try {
      

   
      const res = await axios.get("http://localhost:3000/api/task/task", {
        withCredentials: true,
      });
      setMyTasks(res.data.tasks);
    } catch (error) {
      console.error(" Failed to fetch user tasks", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserTask();
  }, []);

  // Determine client name for welcome message
  

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-inter">
      <div className="text-2xl flex items-center gap-3">
        <i className="ri-loader-4-line animate-spin text-blue-400"></i> Loading Your Tasks...
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-inter overflow-hidden">
      {/* Background Orbs/Glows for visual interest - consistent across pages */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto py-16 px-6 relative z-10 my-tasks-container">
        <h2 className="welcome-title text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-12 drop-shadow-lg">
          <i className="ri-folder-open-fill text-green-300 mr-4"></i> Your Posted Tasks
        </h2>

        {myTasks.length === 0 ? (
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-gray-300 text-xl mb-4">
              <i className="ri-emotion-sad-line text-blue-300 text-4xl block mb-4"></i>
              It looks like you haven't posted any tasks yet.
            </p>
            <motion.button
              onClick={() => navigate('/posttask')}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="ri-add-circle-fill"></i> Post Your First Task
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {myTasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-green-500/30 hover:-translate-y-2 relative overflow-hidden group"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                {/* Card background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                <h3 className="text-2xl font-semibold mb-3 text-white relative z-10">{task.title}</h3>
                <p className="text-lg text-blue-300 mb-2 font-medium relative z-10">
                  💰 Budget: <span className="font-bold">₹{task.budget.toLocaleString()}</span>
                </p>
                <p className="text-gray-300 text-base mb-4 line-clamp-3 relative z-10">{task.description}</p>
                <div className="flex justify-between items-center relative z-10">
                  <span className={getStatusStyle(task.status)}>{task.status}</span>
                  <motion.button
                    onClick={() => navigate(`/taskdetails/${task.id}`)}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center gap-2"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="ri-eye-line"></i> View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      
    </div>
  );
}

export default MyTask;
