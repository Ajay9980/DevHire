import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";

function UploadWork() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);


  async function getTaskById() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/task/task/${id}`, {
        withCredentials: true,
      });
      setTask(res.data.task);
    } catch (error) {
      console.error("Failed to fetch task:", error);
      Swal.fire("Error", "❌ Failed to fetch task.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTaskById();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      Swal.fire("No file selected", "Please choose a file before uploading.", "warning");
      return;
    }

     setUploading(true);

    const formData = new FormData();
    formData.append("files", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasksubmission/upload/task/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      Swal.fire("Success 🎉", `✅ File "${file.name}" uploaded successfully!`, "success");
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire("Upload Failed", "❌ Something went wrong. Please try again.", "error");
    }finally {
    setUploading(false); // Stop uploading
  }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-xl">
        Loading task...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 flex justify-center items-start">
     
     { (task.status === "SUBMITTED" || task.status === "COMPLETED")  && <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4">
  <div className="bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-12 max-w-2xl text-center">
    <div className="flex justify-center mb-6">
      <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg animate-bounce">
        <i className="ri-check-fill text-5xl"></i>
      </div>
    </div>

    <h1 className="text-3xl md:text-4xl font-bold font-inter text-white">
      Your Task Has Been Submitted
    </h1>
    <p className="mt-4 text-gray-300 text-sm md:text-base">
      We've received your submission successfully.  
    </p>
  </div>
</div>

      }
     

     { (task.status === 'IN_PROGRESS' || task.status === 'OPEN' ) && <div> 
  
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl shadow-lg p-8 border border-gray-700 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <ArrowLeft
            className="cursor-pointer hover:text-blue-400 transition"
            onClick={() => navigate("/task")}
          />
          <h1 className="text-3xl font-bold">Upload Work</h1>
        </div>

        {/* Task Details */}
        <div className="space-y-2 border-b border-gray-600 pb-4">
          <h2 className="text-2xl font-semibold text-purple-400">{task.title}</h2>
          <p className="text-gray-400">{task.description}</p>
          <p>
            💰 <strong>Budget:</strong> ₹{task.budget}
          </p>
          <p>
            📌 <strong>Status:</strong> {task.status || "N/A"}
          </p>
          <p>
            👤 <strong>Client:</strong> {task.client?.email || "Unknown"}
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold">📁 Choose your file</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded-md text-sm text-white file:bg-purple-600 file:text-white file:rounded-md file:px-3 file:py-1 file:border-none file:mr-4"
          />

          <button
            onClick={handleUpload}
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium transition shadow-sm"
          >
            <UploadCloud className="w-5 h-5" />   {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>
      </div>
}
    </div>
  );
}

export default UploadWork;
