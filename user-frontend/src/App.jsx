import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./Pages/Register"
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import ReserveBed from "./Pages/ReserveBed"
import ProtectedRoute from "./components/ProtectedRoute"
import BedReservations from "./Pages/Reservation"
import HospitalDetails from "./components/HospitalDetails"
import HospitalDirection from "./components/HospitalDirection"
import Footer from "./components/Footer" // Import the Footer component

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path='/' element={<><Home /><Footer /></>} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/reserveBed/:hospitalId' element={
              <ProtectedRoute>
                <>
                  <ReserveBed />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path='/reservations' element={
              <ProtectedRoute>
                <>
                  <BedReservations />
                  <Footer />
                </>
              </ProtectedRoute>
            } />  
            <Route path="/hospital-details/:id" element={<><HospitalDetails /><Footer /></>} />
            <Route path="/hospital-directions/:hospitalId" element={<><HospitalDirection /><Footer /></>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
