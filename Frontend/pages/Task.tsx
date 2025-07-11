import  { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // use this if you don’t have custom axios
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
 
 

interface Task {
  id: number;
  title: string;
  budget: number;
  description: string;
}

const Task = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user , setUser] = useState<{role : string}>()
  const [menu , setMenu] = useState(false)
  const closeRef = useRef(null)
  const navigate = useNavigate();


  async function getUser(){

    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/user`,{
      withCredentials : true
    })

    setUser(res.data.user)
  }

   
 

  useEffect(() => {
     
     getUser()
 
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/task/tasks`,{
          withCredentials : true
        });  
        setTasks(res.data.tasks);  
      } catch (err) {
        console.error(' Failed to fetch tasks:', err);
      }
    };

    fetchTasks();
  }, []);

 
 




  useGSAP(()=>{
    const tl = gsap.timeline()
    if(menu){

       

      
      tl.from('.navbar',{
      x : 200 ,
      opacity : 0,
      duration : 0.3 ,
      delay : 0.5,
      ease : 'power2.out'
    })

      tl.from('.navelem',{
        x : 50,
        opacity : 0,
        duration :0.5,
        stagger : 0.3,
        ease : 'power2.Out'
      },'-=0.3')

      tl.from('.logo',{
        y : -20,
        opacity : 0,
        duration : 0.5
      },"-=0.3")
 
      
    }

  },[menu])

 

  return  (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      {/* Header */}

      {!user && (
  <header className="bg-white/10 backdrop-blur-lg shadow-md sticky top-0 z-50 py-3 border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text tracking-tight">
        DevHire
      </h1>

      <nav className="hidden md:flex gap-8 text-base text-gray-200 font-medium">
        <button
          onClick={() => navigate("/")}
          className="hover:text-teal-400 relative group"
        >
          Home
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
        </button>

         

        <button
          onClick={() => navigate("/signin")}
          className="hover:text-teal-400 relative group"
        >
          Login
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
        </button>
      </nav>

      {/* Mobile Menu Icon */}
      <i
        className="ri-menu-line text-2xl text-white md:hidden"
        onClick={() => setMenu(true)}
      ></i>
    </div>
  </header>
)}




     {user?.role === 'CLIENT' && (
  <header className="bg-white/10 backdrop-blur-md shadow-md sticky top-0 z-50 py-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text">DevHire</h1>
      <nav className="hidden md:flex gap-6 text-sm text-gray-300 font-semibold">
        <button
          onClick={() => navigate("/")}
          className="hover:text-blue-400 relative before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[2px] before:bg-blue-400 hover:before:w-full hover:before:left-0 before:transition-all before:duration-300"
        >
          Home
        </button>
         
        <button
          onClick={() => navigate("/posttask")}
          className="hover:text-blue-400 relative before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[2px] before:bg-blue-400 hover:before:w-full hover:before:left-0 before:transition-all before:duration-300"
        >
          PostTask
        </button>
        <button
          onClick={() => navigate("/mytask")}
          className="hover:text-blue-400 relative before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[2px] before:bg-blue-400 hover:before:w-full hover:before:left-0 before:transition-all before:duration-300"
        >
          MyTask
        </button>
        <button
          onClick={()=>navigate('/profile')}
          className="hover:text-blue-400 relative before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[2px] before:bg-blue-400 hover:before:w-full hover:before:left-0 before:transition-all before:duration-300"
        >
          Account
        </button>
      </nav>
      <i className="ri-menu-line text-xl md:hidden" onClick={() => setMenu(true)}></i>
    </div>
  </header>
)}




    {user?.role === 'DEVELOPER' && (
  <header className="bg-white/10 backdrop-blur-lg shadow-lg sticky top-0 z-50 py-3 border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text tracking-tight">
        DevHire
      </h1>

      <nav className="hidden md:flex gap-8 text-base text-gray-200 font-medium">
        <button
          onClick={() => navigate("/")}
          className="hover:text-blue-400 relative group"
        >
          Home
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </button>

         

        <button
          onClick={() => navigate("/postedbids")}
          className="hover:text-blue-400 relative group"
        >
          My Bids
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </button>

        <button
          onClick={()=>navigate('/profile')}
          className="hover:text-blue-400 relative group"
        >
          Account
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </button>
      </nav>

      {/* Mobile menu icon */}
      <i
        className="ri-menu-line text-2xl text-white md:hidden"
        onClick={() => setMenu(true)}
      ></i>
    </div>
  </header>
)}

 
      {/* Mobile Menu */}
      {menu && (
        <div ref={closeRef} className="navbar md:hidden fixed top-0 right-0 w-64 h-screen  bg-gradient-to-br from-slate-900 to-indigo-900 text-whitek z-50 shadow-xl p-6 rounded-l-xl">
          <i   className="onclose ri-close-line text-2xl absolute top-4 right-6 cursor-pointer" onClick={()=>setMenu(false)}></i>
          <nav className="flex flex-col mt-20 underline gap-6">
            {["/", "/dashboard", "/signin", "/posttask"].map((route, i) => (
              <button
                key={i}
                onClick={() => navigate(route)}
                className="navelem text-lg hover:text-blue-600"
              >
                {route === "/" ? "Home" : route.replace("/", "")}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-white mb-8">🚀 Explore Open Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-300"><i className="ri-loader-4-line animate-spin text-white text-3xl text-center"></i>...Loading</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                <h3 className="text-2xl font-semibold mb-2 text-white">{task.title}</h3>
                <p className="text-sm text-blue-300 mb-2">💰 Budget: ₹{task.budget}</p>
                <p className="text-gray-300 line-clamp-2">{task.description}</p>

                <div className="mt-4 flex gap-3 flex-wrap">
                  {!user && (
                    <>
                      <button
                        onClick={() => navigate(`/signin`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate('/signin')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        Apply / Bid
                      </button>
                    </>
                  )}

                  {user?.role === 'CLIENT' && (
                    <button
                      onClick={() => navigate(`/taskdetails/${task.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </button>
                  )}

                  {user?.role === 'DEVELOPER' && (
                    <button
                      onClick={() => navigate(`/submitbid/${task.id}`)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Apply / Bid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Task;
