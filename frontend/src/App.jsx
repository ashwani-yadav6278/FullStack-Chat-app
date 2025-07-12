import  { useEffect } from 'react'
import Navbar from './components/Navbar';
import { Route,Routes,Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ResetPassword from './pages/UpdatePassword';
import { useAuthStore } from './store/authStore';
import {Loader} from "lucide-react"
import { useThemeStore } from './store/useThemeStore';

const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
  const {theme}=useThemeStore();
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth])


  useEffect(() => {
     
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if(isCheckingAuth && !authUser) 
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className='w-10 h-10 animate-spin text-blue-500' />
      </div>
    )
  

  return (
    <div >
      <Navbar/>
      <Routes>
        <Route path='/'  element={authUser? <HomePage/> :<Navigate to='/login'/>}/>
        <Route path='/signup' element={!authUser?<SignupPage/>: <Navigate to='/'/>} />
        <Route path='/login' element={!authUser?<LoginPage/>: <Navigate to='/'/>} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/profile' element={authUser ? <ProfilePage/> :<Navigate to='/login'/>} />
        <Route path='/updatepassword' element={authUser ? <ResetPassword/> :<Navigate to='/login'/>} />

      </Routes>
    </div>
  )
}

export default App;
