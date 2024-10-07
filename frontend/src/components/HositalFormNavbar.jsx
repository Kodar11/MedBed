import React, { useState } from "react";
import Navbar from "./Navbar";
import HospitalInfo from "../pages/Hospital-Form/HospitalInfo"
import BedInfoForm from "../pages/Hospital-Form/BedInfoForm"
import DoctorForm from "../pages/Hospital-Form/DoctorForm";
import MedicalEquipmentForm from "../pages/Hospital-Form/MedicalEquipmentForm"
import ServiceForm from "../pages/Hospital-Form/ServiceForm";
import InsuranceForm from "../pages/Hospital-Form/InsuranceForm";
import SinglePhotoUpload from "./Upload_Images/SinglePhotoUpload";
import MultiplePhotoUpload from "./Upload_Images/MultiplePhotoUpload";

// Step-based form handler for Hospital-related schemas
function HospitalFormNavbar() {
    const [activeStep, setActiveStep] = useState(1); // Track the current form step

    const [formData, setFormData] = useState({
        hospital: {},
        beds: {},
        doctor: {},
        medicalEquipment: {},
        service: {},
        insurance: {},
    });

    const data = useState([]);

    const handleFormSubmit = (formName, data) => {
        setFormData((formData) => ({
            ...formData,
            [formName]: data,
        }));
        console.log(`Data for ${formName}: `, data);
        console.log(formData);
    };


    // Render dynamic forms based on the current step (Hospital, BedInfo, Doctor, etc.)
    const renderForm = () => {
        switch (activeStep) {
            case 1:
                // Hospital Information
                return (
                    <HospitalInfo check={(data) => handleFormSubmit("hospital", data)}/>
                );
            case 2:
                // Bed Information
                return (
                    <BedInfoForm check={(data) => handleFormSubmit("beds", data)}/>
                );
            case 3:
                // Doctor Information
                return (
                    <DoctorForm check={(data) => handleFormSubmit("doctor", data)}/>
                );
            case 4:
                // Medical Equipment
                return (
                    <MedicalEquipmentForm check={(data) => handleFormSubmit("medicalEquipment", data)}/>
                );
            case 5:
                // Medical services
                return (
                    <ServiceForm check={(data) => handleFormSubmit("service", data)}/>
                );
            case 6:
                // Medical Equipment
                return (
                    <InsuranceForm check={(data) => handleFormSubmit("insurance", data)}/>
                );
            case 7:
                // Medical Equipment
                return (
                    <>
                        <SinglePhotoUpload/>
                        <MultiplePhotoUpload/>
                    </>
                    
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Navbar />
            <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 shadow-sm sm:text-base sm:p-4 sm:space-x-4">
                <li className={`flex items-center cursor-pointer ${activeStep === 1 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(1)}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 1 ? "border-blue-600" : "border-gray-500"}`}>1</span>
                    Hospital Info
                </li>
                <li className={`flex items-center cursor-pointer ${activeStep === 2 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(2)}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 2 ? "border-blue-600" : "border-gray-500"}`}>2</span>
                    Bed Info
                </li>
                <li className={`flex items-center cursor-pointer ${activeStep === 3 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(3)}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 3 ? "border-blue-600" : "border-gray-500"}`}>3</span>
                    Doctor Info
                </li>
                <li className={`flex items-center cursor-pointer ${activeStep === 4 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(4)}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 4 ? "border-blue-600" : "border-gray-500"}`}>4</span>
                    Medical Equipment
                </li>
                <li className={`flex items-center cursor-pointer ${activeStep === 5 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(5)}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 5 ? "border-blue-600" : "border-gray-500"}`}>5</span>
                    Services
                </li>
                <li className={`flex items-center cursor-pointer ${activeStep === 6 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(6)}>
                    <span className={` flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 6 ? "border-blue-600" : "border-gray-500"}`}>6</span>
                    <p className="max-sm:hidden">Insurances</p>
                </li>
                <li className={`flex items-center cursor-pointer ${activeStep === 7 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(7)}>
                    <span className={` flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 7 ? "border-blue-600" : "border-gray-500"}`}>7</span>
                    <p className="max-sm:hidden">Add Images</p>
                </li>
            </ol>

            <section className="py-1 bg-white">
                <div className="w-full lg:w-8/12 mx-auto">
                    {renderForm()} {/* Render the selected form */}
                </div>
            </section>
        </>
    );
}

export default HospitalFormNavbar;
