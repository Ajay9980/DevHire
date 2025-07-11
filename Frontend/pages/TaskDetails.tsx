import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {   motion } from "framer-motion"; // Corrected import for Framer Motion
import gsap from "gsap"; // Import GSAP
import { useGSAP } from '@gsap/react'; // Import useGSAP hook
 
interface Task {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  client: { email: string };
  developer?: { email: string }; // Optional, if a developer has been assigned
}

interface Bid {
  id: number;
  amount: number;
  proposal: string;
  status: string;
  developer: { name: string; email: string };
}

interface User {
  id: number;
  name : string;
  role: string;
  email: string;
  bids: { id: number; status: string; taskId: number }[];
}

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>(); // Ensure id is string
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<{fileUrl : string}>()
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidProposal, setBidProposal] = useState<string>('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [processing , setProcessing] = useState(false)



  // GSAP animation for page entrance
  useGSAP(() => {
    gsap.fromTo(
      ".task-details-container",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.3 }
    );
    gsap.fromTo(
      ".task-title-animation",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
    );
  }, [loading]); // Re-run when loading state changes (i.e., data is fetched)

  // Framer Motion variants for staggered bid card animations
  const bidContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const bidItemVariants = {
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

  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {

      
      const [userRes, taskRes, bidsRes ] = await Promise.all([
        axios.get('http://localhost:3000/api/user/user', { withCredentials: true }),
        axios.get(`http://localhost:3000/api/task/task/${id}`, { withCredentials: true }),
        axios.get(`http://localhost:3000/api/bid/bid/${id}`, { withCredentials: true }),
         
      ]);
      setUser(userRes.data.user);
      setTask(taskRes.data.task);
      setBids(bidsRes.data.bids);
       
    } catch (err) {
      console.error('❌ Failed to fetch data:', err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to load task details.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };



  async function fileRes(){

      const res = await axios.get(`http://localhost:3000/api/tasksubmission/getfileurl/${id}`,{withCredentials : true})
      setFile(res.data.file)
    }

  useEffect(() => {
     
    fetchData();
  }, [id]); // Re-fetch if ID changes





  useEffect(()=>{

    if(task?.status === 'SUBMITTED' || task?.status === 'COMPLETED') {
      fileRes()
    }

  },[task ,id])




  const isClient = user?.role === 'CLIENT';
  const isDeveloper = user?.role === 'DEVELOPER';
  const acceptedBid = bids.find((b) => b.status === 'ACCEPTED');
  const hasUserBid = user?.bids.some(bid => bid.taskId === Number(id));
  const isAssignedDeveloper = acceptedBid?.developer.email === user?.email;


  // Function to determine status badge styling
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

 


  // Handle Bid Accept
  const handleAccept = async (bidId: number) => {

    setProcessing(true)
    try {
      await axios.post(`http://localhost:3000/api/bid/acceptbid/task/${id}`, { bidId }, {
        withCredentials: true
      });
      
      
      const orderRes = await axios.post('http://localhost:3000/api/payment/createpayment',{taskId : id , bidId},{
        withCredentials : true
      })

      const order = orderRes.data.order


      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js",
      script.async = true,
      document.body.appendChild(script)

      script.onload = () => {
        const client = {
          name : user?.name || "client1",
          email : user?.email || "client1@example.com",
          contact : '9999999999'
        }
      


      const options = {
        key : process.env.cloudinary_test_key,
        amount : order.amount,
        currency : order.currency,
        order_id : order.id,
        name : "DevHire",
        description : 'payment for accepted bid',
        handler : async function(response : any){
          await axios.post(`http://localhost:3000/api/payment/verifypayment`,{

            razorpay_order_id : response.razorpay_order_id,
            razorpay_payment_id : response.razorpay_payment_id,
            razorpay_signature : response.razorpay_signature
          },{
            withCredentials : true
          })
          
          Swal.fire({
            toast : true,
            position : 'top',
            icon : 'success',
            title : 'Payment Successful',
            showConfirmButton : true,
            timer : 2000,
            timerProgressBar : true
          })

          fetchData(); // Re-fetch data to update UI

        },

        prefill : {

          name : client.name,
          email : client.email,
          contact : '9999999999'
        },
        theme : {
          color : '#3399cc'
        },
      }


      const rzp = new (window as any).Razorpay(options);
      rzp.open()

      }


    } catch (err) {
      console.error('❌ Failed to accept bid:', err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to accept bid.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }


    setProcessing(false)
  };








  // Handle Developer placing a bid
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBid(true);
    try {

 

      await axios.post(`http://localhost:3000/api/bid/bid/${id}`, { amount: Number(bidAmount), proposal: bidProposal }, {
        withCredentials: true
      });
      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Bid placed successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      setBidAmount('');
      setBidProposal('');
      fetchData(); // Re-fetch data to update UI
    } catch (err) {
      console.error('❌ Failed to place bid:', err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to place bid.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setIsSubmittingBid(false);
    }
  };

  // Handle Developer submitting task
  const handleSubmitTask = async () => {
    setIsSubmittingTask(true);
    try {
      await axios.post(`http://localhost:3000/api/task/submittask/${id}`, {}, {
        withCredentials: true
      });
      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Task submitted successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      fetchData(); // Re-fetch data to update UI
    } catch (err) {
      console.error('❌ Failed to submit task:', err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to submit task.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Handle Client marking task complete
  const markComplete = async () => {
    setIsMarkingComplete(true);
    try {
      await axios.post(`http://localhost:3000/api/task/markcomplete/${id}`,{},{
        withCredentials: true
      });


      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Task marked as completed!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      fetchData(); // Re-fetch data to update UI
    } catch (err) {
      console.error('❌ Failed to mark task complete:', err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to mark task complete.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-inter">
      <div className="text-2xl flex items-center gap-3">
        <i className="ri-loader-4-line animate-spin text-blue-400"></i> Loading Task Details...
      </div>
    </div>
  );
  if (!task) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-inter">
      <div className="text-2xl text-red-400 flex items-center gap-3">
        <i className="ri-error-warning-line"></i> Task not found.
      </div>
    </div>
  );


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-inter overflow-hidden">
      {/* Background Orbs/Glows for visual interest - consistent across pages */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10 task-details-container">
        <motion.button
          onClick={() => navigate('/task')}
          className="text-blue-400 mb-8 flex items-center gap-2 hover:text-blue-300 transition-colors duration-300"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="ri-arrow-left-line"></i> Back to Tasks
        </motion.button>

        {/* Task Details Card */}
        <motion.div
          className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mb-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="task-title-animation text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
            {task.title}
          </h1>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">{task.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            <p className="flex items-center gap-2">
              <i className="ri-wallet-line text-blue-300"></i>
              <strong className="text-blue-200">Budget:</strong> ₹{task.budget.toLocaleString()}
            </p>
            <p className="flex items-center gap-2">
              <i className="ri-flag-line text-green-300"></i>
              <strong className="text-green-200">Status:</strong> <span className={getStatusStyle(task.status)}>{task.status}</span>
            </p>
            <p className="flex items-center gap-2">
              <i className="ri-user-3-line text-purple-300"></i>
              <strong className="text-purple-200">Client:</strong> {task.client.email}
            </p>

            {(task.status === 'SUBMITTED' || task.status === 'COMPLETED') && 

              <p className="flex items-center gap-2">
              <i className="ri-user-3-line text-purple-300"></i>
              <strong className="text-purple-200">File Link :
                </strong> <div className='w-full break-all text-blue-300 underline'>
                  <a
                    href={file?.fileUrl.replace("/upload/", "/upload/fl_attachment/")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    download
                  >
                    Download File
                  </a>

                </div> 
            </p>

            }



            {task.developer && (
              <p className="flex items-center gap-2">
                <i className="ri-code-s-slash-line text-teal-300"></i>
                <strong className="text-teal-200">Assigned Dev:</strong> {task.developer.email}
              </p>
            )}
          </div>
        </motion.div>

        {/* Bids Section (Client View) */}
        {isClient && (
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
              <i className="ri-hand-coin-line text-yellow-300"></i> Bids Received
            </h2>
            {bids.length === 0 ? (
              <p className="text-gray-400 text-lg">No bids yet for this task.</p>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={bidContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {bids.map((b) => (
                  <motion.div
                    key={b.id}
                    className="bg-gray-800/50 p-6 rounded-2xl shadow-xl border border-gray-700 transition-all duration-300 hover:shadow-yellow-500/30 hover:-translate-y-1 relative overflow-hidden group"
                    variants={bidItemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    <h3 className="text-xl font-semibold mb-2 text-white relative z-10">
                      Developer: <span className="text-yellow-300">{b.developer.name}</span>
                    </h3>
                    <p className="text-lg text-blue-300 mb-2 relative z-10">
                      💰 Amount: <span className="font-bold">₹{b.amount.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-300 text-base mb-4 line-clamp-3 relative z-10">
                      Proposal: {b.proposal}
                    </p>
                    <div className="flex justify-between items-center relative z-10">
                      {b.status === 'ACCEPTED' ? (
                        <span className="text-green-400 font-bold text-lg flex items-center gap-2">
                          <i className="ri-check-double-line"></i> Accepted
                        </span>
                      ) : (
                        <span className={getStatusStyle(b.status)}>{b.status}</span>
                      )}

                      {b.status === 'PENDING' && !acceptedBid && ( // Only show if pending and no bid is accepted yet
                        <motion.button
                          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center gap-2"
                          onClick={() => handleAccept(b.id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="ri-check-line"></i> { processing ? "...Processing" : 'Accept Bid & Pay'}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Place Bid Section (Developer View) */}
        {isDeveloper && !hasUserBid && !acceptedBid && (
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
              <i className="ri-send-plane-fill text-green-300"></i> Place Your Bid
            </h2>
            <form onSubmit={handlePlaceBid}>
              <div className="mb-6">
                <label htmlFor="bidAmount" className="block text-lg font-medium text-gray-200 mb-2">
                  Your Bid Amount (₹)
                </label>
                <motion.input
                  type="number"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="e.g., 18000"
                  className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  required
                  min="1"
                  whileFocus={{ scale: 1.01, borderColor: "#10B981", boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.2)" }}
                />
              </div>
              <div className="mb-8">
                <label htmlFor="bidProposal" className="block text-lg font-medium text-gray-200 mb-2">
                  Your Proposal
                </label>
                <motion.textarea
                  id="bidProposal"
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                  placeholder="Describe why you're the best fit for this task..."
                  rows={5}
                  className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-y"
                  required
                  whileFocus={{ scale: 1.01, borderColor: "#10B981", boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.2)" }}
                ></motion.textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmittingBid}
              >
                {isSubmittingBid ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i> Submitting Bid...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-fill"></i> Submit Bid
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Developer already bid / bid status */}
        {isDeveloper && hasUserBid && !acceptedBid && (
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-white flex items-center justify-center gap-3">
              <i className="ri-information-line text-blue-300"></i> Bid Status
            </h2>
            <p className="text-xl text-gray-300">
              You have already placed a bid on this task. Your bid is currently <span className={getStatusStyle(user.bids.find(bid => bid.taskId === Number(id))?.status || 'UNKNOWN')}>
                {user.bids.find(bid => bid.taskId === Number(id))?.status || 'UNKNOWN'}
              </span>.
            </p>
            <p className="text-gray-400 mt-4">We will notify you once the client reviews the bids.</p>
          </motion.div>
        )}

        {/* Developer - Submit Task (if assigned) */}
        {isDeveloper && isAssignedDeveloper && task.status !== 'COMPLETED' && (
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center justify-center gap-3">
              <i className="ri-upload-cloud-2-fill text-purple-300"></i> Task Delivery
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Great job! Once you've completed the task, click the button below to submit it for client review.
            </p>
            <motion.button
              onClick={handleSubmitTask}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmittingTask || task.status === 'SUBMITTED'}  
            >
              {isSubmittingTask ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="ri-check-circle-fill"></i> {task.status === 'SUBMITTED' ? 'Task Submitted' : 'Submit Task'}
                </>
              )}
            </motion.button>
          </motion.div>
        )}


        {/* Client - Mark Complete (if task is submitted by developer) */}
        {isClient && acceptedBid && task.status === 'SUBMITTED' && (
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center justify-center gap-3">
              <i className="ri-medal-fill text-green-300"></i> Finalize Task
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              The developer has submitted the task. Please review the work and mark it as completed to release payment.
            </p>
            <motion.button
              onClick={markComplete}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isMarkingComplete}
            >
              {isMarkingComplete ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i> Marking Complete...
                </>
              ) : (
                <>
                  <i className="ri-check-double-line"></i> Mark Task as Completed
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Client - Task Completed Message */}
        {isClient && task.status === 'COMPLETED' && (
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center justify-center gap-3">
              <i className="ri-award-fill text-yellow-400"></i> Task Completed!
            </h2>
            <p className="text-xl text-gray-300">
              This task has been successfully completed and finalized. Congratulations!
            </p>
          </motion.div>
        )}

      </div>

      
    </div>
  );
};

export default TaskDetails;
