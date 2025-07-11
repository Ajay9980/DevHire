import { BrowserRouter, Routes , Route } from 'react-router-dom'
import './App.css'
import Signup from '../pages/Signup'
import Signin from '../pages/Signin'
import Home from '../pages/Home'
import Task from '../pages/Task'
import PostTask from '../pages/PostTask'
import TaskDetails from '../pages/TaskDetails'
import MyTask from '../pages/MyTask'
import SubmitBid from '../pages/SubmitBid'
import PostedBids from '../pages/PostedBids'
import UploadWork from '../pages/UploadWork'
import Workdetails from '../pages/Workdetails'
import Profile from '../pages/Profile'
function App() {
 

  return (
   <BrowserRouter>
   <Routes>
    <Route path = '/' element = {<Home/>}  />
    <Route path = '/profile' element = {<Profile/>}  />
    <Route path = '/workdetails/:id' element = {<Workdetails/>}  />
    <Route path = '/uploadwork/:id' element = {<UploadWork/>}  />
    <Route path = '/postedbids' element = {<PostedBids/>}  />
    <Route path = '/submitbid/:id' element = {<SubmitBid/>}  />
    <Route path = '/mytask' element = {<MyTask/>}  />
    <Route path = '/taskdetails/:id' element = {<TaskDetails/>}  />
    <Route path = '/posttask' element = {<PostTask/>}  />
    <Route path = '/task' element = {<Task/>}  />
    <Route path = '/signup' element = {<Signup/>}  />
    <Route path = '/signin' element = {<Signin/>}  />
   </Routes>
   </BrowserRouter>
  )
}

export default App
