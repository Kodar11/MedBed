import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HospitalInfo from "./HospitalInfo";
import DoctorForm from "./DoctorForm";
import MedicalEquipmentForm from "./MedicalEquipmentForm";
import ServiceForm from "./ServiceForm";
import InsuranceForm from "./InsuranceForm";
import HospitalFormNavbar from "../../components/HositalFormNavbar";

function HospitalForm() {
    // const [formData, setFormData] = useState({
    //     hospital: {},
    //     doctor: {},
    //     medicalEquipment: {},
    //     service: {},
    //     insurance: {},
    // });

    // const data = useState([]);

    // const handleFormSubmit = (formName, data) => {
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [formName]: data,
    //     }));
    //     console.log(`Data for ${formName}: `, data);
    // };

    // function check(data) {
    //   handleFormSubmit("hospital", data);
    // }

    // function hello(){
    //     console.log(""
    // }

    return (
        // <Router>
        //     <Routes>
        //         <Route
        //             path="/hospital-info"
        //             element={<HospitalInfo onSubmit={check(data)}  />}
        //         />
        //         {/* <Route
        //             path="/doctor"
        //             element={<DoctorForm onSubmit={(data) => handleFormSubmit("doctor", data)} />}
        //         />
        //         <Route
        //             path="/medical-equipment"
        //             element={<MedicalEquipmentForm onSubmit={(data) => handleFormSubmit("medicalEquipment", data)} />}
        //         />
        //         <Route
        //             path="/service"
        //             element={<ServiceForm onSubmit={(data) => handleFormSubmit("service", data)} />}
        //         />
        //         <Route
        //             path="/insurance"
        //             element={<InsuranceForm onSubmit={(data) => handleFormSubmit("insurance", data)} />}
        //         />*/}
        //     </Routes> 
        // </Router>
        <HospitalFormNavbar />
    );
}

export default HospitalForm;
