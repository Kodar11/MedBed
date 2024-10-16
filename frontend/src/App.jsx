import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Home from "./components/Home"
import HospitalFormNavbar from './components/HositalFormNavbar'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import HospitalInfo from './pages/Hospital-Form/HospitalInfo'
import HospitalForm from './pages/Hospital-Form/HospitalForm'
import FileUpload from './pages/FileUpload'
import MultiplePhotoUpload from './components/Upload_Images/MultiplePhotoUpload'
import SinglePhotoUpload from './components/Upload_Images/SinglePhotoUpload'
import HospitalPage from './pages/Hospital_Info/HosiptalPage'
import HospitalCard from './components/User_components/HospitalCard'
import HospitalList from './components/User_components/HospitalList'
import Home from './components/User_components/Home'

import HospitalDetails from './pages/Hospital_Info/HospitalDetails';
import HospitalLogin from './pages/HospitalLogin'
import HospitalHome from './pages/HospitalHome'
import HospitalDirection from './components/User_components/HospitalDirection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      {/* <HospitalForm/> */}
      {/* <HospitalFormNavbar/> */}

      {/* <Router>
        <Routes>
          <Route path="/hospital-info-form" element={<HospitalInfo/>}/>
        </Routes>
      </Router> */}

      {/* <HospitalHome/> */}
      <BrowserRouter>
        <Routes>
          {/* <Route path="/"  element={<Home/>} />
          <Route path="/hospital-details/:id" element={<HospitalDetails />} /> */}
          {/* <Route path="/user-login" element={<UserLogin />} /> */}
        <Route path="/" element={<HospitalLogin />} />
        <Route path="/hospital-home" element={<HospitalHome />} />
        <Route path="/hospital-form" element={<HospitalFormNavbar />} />
        <Route path="/hospital-directions/:hospitalId" element={<HospitalDirection/>} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
