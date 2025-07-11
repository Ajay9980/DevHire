import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Task = {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string | null;
};

type Bid = {
  id: number;
  amount: number;
  proposal: string;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
  taskId: number;
  developerId: number;
  task: Task;
};

function PostedBids() {

    const navigate = useNavigate()
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  async function getuserBid() {
    try {
      const res = await axios.get("http://localhost:3000/api/task/bidtask", {
        withCredentials: true,
      });
      setBids(res.data.tasks);
    } catch (error) {
      console.error("Failed to fetch bids:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getuserBid();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0f172a]">
        <div className="text-[3vw] text-white animate-pulse"> Loading bids...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-[7vw] font-bold text-center mb-8"> My Bids</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {bids.map((bid) => (
          <div onClick={()=>navigate(`/workdetails/${bid.task.id}`)}
            key={bid.id}
            className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 shadow-md"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-green-400">
                🛠 {bid.task.title}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                💬 {bid.task.description}
              </p>
              <p className="text-sm mt-2 text-blue-300">
                💰 Budget: ₹{bid.task.budget}
              </p>
            </div>

            <div className="mb-2">
              <p className="text-sm">
                🧾 <strong>Your Proposal:</strong>{" "}
                <span className="text-gray-300">{bid.proposal}</span>
              </p>
              <p className="text-sm mt-1">
                💸 <strong>Bid Amount:</strong>{" "}
                <span className="text-yellow-400">₹{bid.amount}</span>
              </p>
            </div>

            <div className="mt-4">
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${
                  bid.status === "ACCEPTED"
                    ? "bg-green-600 text-white"
                    : bid.status === "REJECTED"
                    ? "bg-red-600 text-white"
                    : "bg-yellow-400 text-black"
                }`}
              >
                {bid.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostedBids;
