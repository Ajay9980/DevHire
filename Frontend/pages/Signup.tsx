import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from "sweetalert2";
import { motion } from "motion/react";
import { FiCamera } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "CLIENT",
  });

  const [file , setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {

      const data = new FormData()

      data.append("email" , formData.email)
      data.append("password", formData.password)
      data.append("name", formData.name)
      data.append("role", formData.role)
      if(file){
        data.append("files",file)
      }
      

      if(!file){
        Swal.fire({
          toast : true,
          icon : 'warning',
          position : 'top',
          title : 'select the image',
          showConfirmButton : false,
          timer : 2000
        })
        return
      }
      // await axios.post("http://localhost:3000/api/user/signup",data);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,data);

      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'User signed up successfully!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: 'white',
        color: 'black'
      });

      navigate("/task");
    } catch (err) {
      console.error("Signup failed:", err);

      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'error',
        title: 'Signup failed, try again!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: 'white',
        color: 'black'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400">Create Account 🚀</h2>

         {/* image upload */}
            <div className="flex flex-col justify-center items-center">

             
          <label className="relative group cursor-pointer text-center">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
            />
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e)=>setFile(e.target.files?.[0] || null)}
            />
          </label>
          <h2 className="text-xl font-semibold">User Image</h2>
          </div>

         {/* image upload */}


        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder:text-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder:text-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder:text-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="CLIENT">CLIENT</option>
          <option value="DEVELOPER">DEVELOPER</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-3 rounded-lg"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-300">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-400 hover:underline transition"
            type="button"
          >
            Login
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
