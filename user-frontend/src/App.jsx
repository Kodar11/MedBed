import { BrowserRouter, Routes, Route, } from "react-router-dom"
import Register from "./Pages/Register"
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import ReserveBed from "./Pages/ReserveBed"
import ProtectedRoute from "./components/ProtectedRoute"
import BedReservations from "./Pages/Reservation"
import HospitalDetails from "./components/HospitalDetails"
import HospitalDirection from "./components/HospitalDirection"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/reserveBed/:hospitalId' element={
            <ProtectedRoute> <ReserveBed /> </ProtectedRoute>
          }></Route>
          <Route path='/reservations' element={
            <ProtectedRoute> <BedReservations /> </ProtectedRoute>
          }></Route>  
          <Route path="/hospital-details/:id" element={<HospitalDetails />} />
          <Route path="/hospital-directions/:hospitalId" element={<HospitalDirection/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
