import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
};

type Bid = {
  id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
  developerId: number;
  taskId : number;
};

function Workdetails() {
  const { id } = useParams(); // this is the task ID
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [bids, setBids] = useState<Bid[] >([]);
  const [loading, setLoading] = useState(true);

  async function getUser() {
    const res = await axios.get("http://localhost:3000/api/user/user", {
      withCredentials: true,
    });
    setUser(res.data.user);
  }

  async function getBidByTaskId() {
    const res = await axios.get(
      `http://localhost:3000/api/bid/bidbytaskid/${id}`,
      {
        withCredentials: true,
      }
    );
    setBids(res.data.bids || []);
  }

  useEffect(() => {
    async function fetchData() {
      await Promise.all([getUser(), getBidByTaskId()]);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  // Find accepted bid for the current user
  const acceptedBid = bids.find(
    (bid) => bid.status === "ACCEPTED" && bid.developerId === user?.id
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4">
      {!acceptedBid ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold">❌ Your bid has not been accepted yet.</h1>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">✅ Your bid is accepted! You can proceed now.</h1>
          <button
            onClick={() => navigate(`/uploadwork/${acceptedBid.taskId}`)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md"
          >
            PROCEED
          </button>
        </div>
      )}
    </div>
  );
}

export default Workdetails;
