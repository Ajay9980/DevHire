 
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
const Profile = () => {

  const navigate = useNavigate()
   
  const [user , setUser] = useState<{ imgurl : string , email : string , name : string , role :'CLIENT' | 'DEVELOPER'}>()
  const [earning , setEarning] = useState()
  async function getUser(){

    // const res = await axios.get("http://localhost:3000/api/user/user",{
    const res = await axios.get("${import.meta.env.VITE_BACKEND_URL}/api/user/user",{
      withCredentials : true
    })

    setUser(res.data.user)
  }

  useEffect(()=>{
    getUser()
  },[])


  async function getUserEarnings(){

    const res = await axios.get('http://localhost:3000/api/payment/getuserpayment',{
    const res = await axios.get('${import.meta.env.VITE_BACKEND_URL}/api/payment/getuserpayment',{
      withCredentials : true
    })
   setEarning(res.data.earnings) 
  }


  useEffect(()=>{
    if(user?.role === 'DEVELOPER'){
      getUserEarnings()
    }
  },[user])

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/user/signout', {},{
        withCredentials : true
      });

      Swal.fire({
        toast : true,
        position : 'top',
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        width: '400px',
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/task')

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'Something went wrong.',
      });
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-inter ">
      <div className="    p-8 rounded-xl shadow-md w-full max-w-md text-center bg-gradient-to-br from-purple-950 via-indigo-950 to-gray-950 text-white font-inter ">
        <h2 className="text-3xl font-semibold mb-4">Profile</h2>
        <hr />
        <div className='flex justify-center items-center rounded-md'>
            <img src={user?.imgurl} alt="img" className='m-4 rounded-xl' />
        </div>
        {user?.role === 'DEVELOPER' && 
        <div className='my-10'>
          <h1 className='text-4xl'>Earnings : <span className='text-blue-500'>{earning}rs</span> </h1>
        </div>
        }
          <hr  className='mb-5'/>
        <div className="text-left mb-6  ">
          <p className="text-lg font-medium">👤 Name: <span className="font-normal">{user?.name}</span></p>
          <p className="text-lg font-medium">📧 Email: <span className="font-normal">{user?.email}</span></p>
        </div>

        <div className="flex flex-col gap-3">
          {user?.role === 'CLIENT' &&
          <button
            onClick={()=>navigate('/mytask')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
          >
            My Tasks
          </button>
          }

          {user?.role === 'DEVELOPER' &&
          <button
            onClick={()=>navigate('/postedbids')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
          >
            My Bids
          </button>
          }

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
