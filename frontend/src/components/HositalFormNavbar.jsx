import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";

import HospitalInfo from "../pages/Hospital-Form/HospitalInfo";
import BedInfoForm from "../pages/Hospital-Form/BedInfoForm";
import DoctorForm from "../pages/Hospital-Form/DoctorForm";
import MedicalEquipmentForm from "../pages/Hospital-Form/MedicalEquipmentForm";
import ServiceForm from "../pages/Hospital-Form/ServiceForm";
import InsuranceForm from "../pages/Hospital-Form/InsuranceForm";
import HealthPackage from "../pages/Hospital-Form/HealthPackage";
import UploadImages from "../pages/Hospital-Form/UploadImages";
import NavBar from "./Navbar";

function HospitalFormNavbar() {
    const [activeStep, setActiveStep] = useState(1);
    const [isFound, setIsFound] = useState(false);

    const [formData, setFormData] = useState({
        hospital: {},
        beds: {},
        doctor: {},
        medicalEquipment: {},
        service: {},
        insurance: {},
        healthPackages: {},

    });

    const navigate = useNavigate();

    const handleFormSubmit = (formName, data, stepNo) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [formName]: data,
        }));
        setActiveStep(stepNo);
        console.log(formData);

    };

    const { hospitalId } = useParams();
    console.log(hospitalId);

    const { id } = hospitalId;


    useEffect(() => {
        // Fetch hospital data only if hospitalId exists
        const fetchHospitalData = async () => {
            if (!hospitalId) {
                console.error("No hospitalId provided");
                return;
            }

            try {
                const response = await axios.get(`https://medbed.onrender.com/api/v1/hospitals/getHospitalById`, {
                    params: {
                        requestId: hospitalId
                    }
                });

                const { hospital, beds, doctors, medicalEquipments, services, insurances, healthPackages } = response.data;

                // Set the form data with the fetched hospital data
                setFormData({
                    hospital,
                    beds,
                    doctor: doctors,
                    medicalEquipment: medicalEquipments,
                    service: services,
                    insurance: insurances,
                    healthPackages: healthPackages
                });
                console.log("Hospital data fetched successfully:", response.data);
                setIsFound(true);
            } catch (error) {
                // console.error("Error fetching hospital data:", error.response?.data || error.message);
            }
        };

        fetchHospitalData();
    }, [hospitalId]);



    const handleFinalSubmit = async () => {

        console.log(formData);

        // Create the hospital in the backend
        if (isFound == false) {
            try {
                const response = await axios.post(
                    'https://medbed.onrender.com/api/v1/hospitals/createHospital',
                    formData,

                );
                console.log("Hospital created successfully", response.data);
                navigate(`/hospital-home/${hospitalId}`);
            } catch (error) {
                console.error("Error creating hospital:", error.response?.data || error.message);
            }
        }
        else {
            try {
                const response = await axios.put(
                    `https://medbed.onrender.com/api/v1/hospitals/updateHospital/${hospitalId}`,
                    formData,
                );

                console.log("Hospital updated successfully", response.data);
                navigate(`/hospital-home/${hospitalId}`);
            } catch (error) {
                console.error("Error updating hospital:", error.response?.data || error.message);
            }
        }
    };



    const renderForm = () => {
        switch (activeStep) {
            case 1:
                return <HospitalInfo
                    data={formData.hospital} // Pass saved data
                    check={(data, stepNo) => handleFormSubmit("hospital", data, stepNo)}
                />;
            case 2:
                return <BedInfoForm
                    data={formData.beds} // Pass saved data
                    check={(data, stepNo) => handleFormSubmit("beds", data, stepNo)}
                />;
            case 3:
                return <DoctorForm
                    data={formData.doctor} // Pass saved data
                    check={(data, stepNo) => handleFormSubmit("doctor", data, stepNo)}
                />;
            case 4:
                return <MedicalEquipmentForm
                    data={formData.medicalEquipment} // Pass saved data
                    check={(data, stepNo) => handleFormSubmit("medicalEquipment", data, stepNo)}
                />;
            case 5:
                return <ServiceForm
                    data={formData.service} // Pass saved data
                    check={(data, stepNo) => handleFormSubmit("service", data, stepNo)}
                />;
            case 6:
                return <InsuranceForm
                    data={formData.insurance} // Pass saved data
                    check={(data, stepNo) => handleFormSubmit("insurance", data, stepNo)}
                />;
            case 7:
                return <HealthPackage
                    data={formData.healthPackages} // Pass saved data
                    check={(data, stepNo) => handleFormSubmit("healthPackages", data, stepNo)}
                />;
            case 8:
                return (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h2 className="text-xl font-semibold">Review and Submit</h2>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleFinalSubmit}>
                            Submit Hospital Form
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <>
            <NavBar/>
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
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 6 ? "border-blue-600" : "border-gray-500"}`}>6</span>
                    <p className="max-sm:hidden">Insurances</p>
                </li>
                <li className={`flex items-center cursor-pointer ${activeStep === 7 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(7)}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 7 ? "border-blue-600" : "border-gray-500"}`}>7</span>
                    <p className="max-sm:hidden">Health Packages</p>
                </li>

                <li className={`flex items-center cursor-pointer ${activeStep === 8 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(8)}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 8 ? "border-blue-600" : "border-gray-500"}`}>8</span>
                    <p className="max-sm:hidden">Submit</p>
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

{/* <li className={`flex items-center cursor-pointer ${activeStep === 8 ? "text-blue-600" : ""}`} onClick={() => setActiveStep(8)}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full ${activeStep === 8 ? "border-blue-600" : "border-gray-500"}`}>8</span>
                    <p className="max-sm:hidden">Add Images</p>
                </li> */}

export default HospitalFormNavbar;
