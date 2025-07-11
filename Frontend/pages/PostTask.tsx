import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";  
import gsap from "gsap"; 
import { useGSAP } from "@gsap/react"; 

 

const PostTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);  

  const navigate = useNavigate();

  // GSAP animation for page entrance
  useGSAP(() => {
    gsap.fromTo(
      ".form-container-animation",
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    const dataToSend = {
      ...formData,
      budget: Number(formData.budget),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/task/tasks`, dataToSend, {
        withCredentials: true,
      });

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Task posted successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/task");
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to post task",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-inter overflow-hidden">
      {/* Background Orbs/Glows for visual interest - consistent with previous page */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <motion.form
        onSubmit={handleSubmit}
        className="form-container-animation bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 50, scale: 0.95 }} // Framer Motion initial state (GSAP will override for entrance)
        animate={{ opacity: 1, y: 0, scale: 1 }} // Framer Motion animate state
        transition={{ type: "spring", stiffness: 100, damping: 20 }} // Framer Motion transition
      >
        <h2 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
          Post a New Task
        </h2>

        {/* Input Field: Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-gray-200 mb-2">
            Task Title
          </label>
          <motion.input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Build a stunning portfolio website"
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
            whileFocus={{ scale: 1.01, borderColor: "#60A5FA", boxShadow: "0 0 0 4px rgba(96, 165, 250, 0.2)" }}
          />
        </div>

        {/* Textarea Field: Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-lg font-medium text-gray-200 mb-2">
            Description
          </label>
          <motion.textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of the task requirements..."
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-y"
            rows={6}
            required
            whileFocus={{ scale: 1.01, borderColor: "#60A5FA", boxShadow: "0 0 0 4px rgba(96, 165, 250, 0.2)" }}
          />
        </div>

        {/* Input Field: Budget */}
        <div className="mb-8">
          <label htmlFor="budget" className="block text-lg font-medium text-gray-200 mb-2">
            Budget (₹)
          </label>
          <motion.input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g., 20000"
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
            min="0" // Ensure budget is non-negative
            whileFocus={{ scale: 1.01, borderColor: "#60A5FA", boxShadow: "0 0 0 4px rgba(96, 165, 250, 0.2)" }}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting} // Disable button during submission
        >
          {isSubmitting ? (
            <>
              <i className="ri-loader-4-line animate-spin"></i> Posting...
            </>
          ) : (
            <>
              <i className="ri-send-plane-fill"></i> Post Task
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Tailwind CSS Customizations (add to your tailwind.config.js) */}
      {/*
      module.exports = {
        theme: {
          extend: {
            fontFamily: {
              inter: ['Inter', 'sans-serif'],
            },
            animation: {
              blob: "blob 7s infinite",
            },
            keyframes: {
              blob: {
                "0%": {
                  transform: "translate(0px, 0px) scale(1)",
                },
                "33%": {
                  transform: "translate(30px, -50px) scale(1.1)",
                },
                "66%": {
                  transform: "translate(-20px, 20px) scale(0.9)",
                },
                "100%": {
                  transform: "translate(0px, 0px) scale(1)",
                },
              },
            },
          },
        },
      };
      */}
      {/* Google Fonts - Inter & Remixicon (add these to your public/index.html or main CSS) */}
      {/*
      <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      */}
    </div>
  );
};

export default PostTask;
