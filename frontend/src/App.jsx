import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./components/Home"
import HospitalFormNavbar from './components/HositalFormNavbar'
import { Router ,Routes, Route} from 'react-router-dom'
import HospitalInfo from './pages/Hospital-Form/HospitalInfo'
import HospitalForm from './pages/Hospital-Form/HospitalForm'
import FileUpload from './pages/FileUpload'
import MultiplePhotoUpload from './components/Upload_Images/MultiplePhotoUpload'
import SinglePhotoUpload from './components/Upload_Images/SinglePhotoUpload'
import HospitalPage from './pages/Hospital_Info/HosiptalPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Home/> */}
      <HospitalForm/>
      {/* <HospitalFormNavbar/> */}

      {/* <Router>
        <Routes>
          <Route path="/hospital-info-form" element={<HospitalInfo/>}/>
        </Routes>
      </Router> */}

      {/* <FileUpload/> */}
      {/* <MultiplePhotoUpload/>
      <SinglePhotoUpload/> */}

      {/* <HospitalPage/> */}
    </>
  )
}

export default App
