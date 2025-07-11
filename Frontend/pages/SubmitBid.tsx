import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function SubmitBid() {
  const { id } = useParams();
  
  const [task, setTask] = useState<any>();
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [button , setButton] = useState(false)
  const [rewrittenText , setRewrittenText] = useState('')
  const [reWriting , setReWriting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    ;
    getTask();
  }, []);


  const reWriteWithAi = async(inputText : string) => {

    setReWriting(true)

    const res = await axios.post('http://localhost:3000/api/rewrite/rewrite',{text : inputText},{
      withCredentials : true
    })

    const text = res.data.rewrittenText
    setRewrittenText(text)

    setReWriting(false)

  }

   

  const getTask = async () => {
    const res = await axios.get(`http://localhost:3000/api/task/task/${id}`, {
      withCredentials: true,
    });
    setTask(res.data.task);
  };

  const handleBidSubmit = async (taskId: number) => {
    setButton(true)
    await axios.post(
      `http://localhost:3000/api/bid/bid/${taskId}`,
      {
        amount: Number(amount),
        proposal,
      },
      {
        withCredentials: true,
      }
    );

    Swal.fire({
      title: "Bid Submitted 🎉",
      html: `💰 <strong>Amount:</strong> ₹${amount}<br>📝 <strong>Proposal:</strong> ${proposal}`,
      icon: "success",
      confirmButtonText: "OK",
    });
    setButton(false)
    navigate('/task')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex items-center justify-center px-4 py-12">
                       
      <div className="bg-[#1e293b] border border-gray-700 rounded-xl shadow-lg p-8 w-full max-w-2xl">

        <h2 className="text-3xl font-bold mb-6 text-center text-white">📝 Submit a Bid</h2>

        {/* Task Info */}
        {task && (
          <div className="bg-[#0f172a] rounded-lg p-4 mb-6 text-gray-200 border border-gray-700">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p className="text-sm text-blue-300 mt-1">💰 Budget: ₹{task.budget}</p>
            <p className="mt-2 text-sm text-gray-400">{task.description}</p>
          </div>
        )}

        {/* Bid Form */}
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Your Bid Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Write your proposal here..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />


          { rewrittenText && 
          <textarea
            placeholder="your proposal is rewritten with AI is here..."
            value={rewrittenText}
            onChange={(e) => setProposal(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          }




          <button
            onClick={()=>reWriteWithAi(proposal)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 w-full"
          >
            {reWriting ? "Re-Writing.." : "Rewrite With Ai"}
          </button>






          <button
            onClick={() => handleBidSubmit(task?.id)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 w-full"
          >
            {button ? "...Loading" : "Submit Bid"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitBid;
