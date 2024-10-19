import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const HospitalDetails = () => {
  const { id } = useParams();
  const [hospital, setHospital] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/hospitals/getHospitalById?requestId=${id}`);
        setHospital(response.data.hospital);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hospital details:', error);
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!hospital) {
    return <p>No hospital data available.</p>;
  }

  return (
    <div className='h-full bg-blue-50'>
    <div className="max-w-5xl mx-auto my-12 p-8 bg-white rounded-lg shadow-xl">
      {/* Hospital Information */}
      <h2 className="text-4xl font-extrabold mb-6 text-blue-700 text-center">{hospital.name}</h2>

      <div className="space-y-4 text-gray-700 text-center mb-12">
        <p className="text-lg"><strong className="font-bold">Location:</strong> {hospital.address}, {hospital.city}, {hospital.state}, {hospital.zip_code}</p>
        <p className="text-lg"><strong className="font-bold">Contact:</strong> {hospital.contact_number}</p>
        <p className="text-lg"><strong className="font-bold">Email:</strong> {hospital.email}</p>
        <p className="text-lg"><strong className="font-bold">Website:</strong> <a href={`http://${hospital.website}`} className="text-blue-500 hover:text-blue-700">{hospital.website}</a></p>
        <p className="text-lg"><strong className="font-bold">Type:</strong> {hospital.type}</p>
        <p className="text-lg"><strong className="font-bold">Accreditation:</strong> {hospital.accreditation}</p>
      </div>

      {/* Doctors Section */}
      <div className="mb-12">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Doctors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
          {hospital.Doctors?.map((doctor, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow">
              {/* <img src={doctor.image_url} alt={doctor.name} className="w-24 h-24 mx-auto rounded-full mb-4 shadow-lg" /> */}
              <h4 className="text-lg font-semibold text-blue-700">{doctor.name}</h4>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-500">{doctor.qualification}</p>
              <p className="text-gray-500">{doctor.experience_years} years of experience</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bed Information Section */}
      <div className="mb-12">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Bed Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hospital.BedInfos?.map((bedInfo, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow">
              {/* <img src={bedInfo.image_url} alt={bedInfo.bed_type} className="w-20 h-20 mb-4 md:mb-0 md:mr-4 rounded shadow-lg" /> */}
              <div className="text-center md:text-left">
                <h4 className="font-bold text-lg">{bedInfo.bed_type}</h4>
                <p>Total Beds: {bedInfo.total_beds}</p>
                {/* <p>Available: {bedInfo.available_beds}</p> */}
                <p>Price: <span className="text-green-600">₹{bedInfo.price}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Equipments Section */}
      <div className="mb-12">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Medical Equipments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hospital.MedicalEquipments?.map((equipment, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow">
              {/* <img src={equipment.image_url} alt={equipment.equipment_name} className="w-20 h-20 mb-4 md:mb-0 md:mr-4 rounded shadow-lg" /> */}
              <div className="text-center md:text-left">
                <h4 className="font-bold text-lg">{equipment.equipment_name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-12">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hospital.Services?.map((service, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow">
              {/* <img src={service.image_url} alt={service.service_name} className="w-20 h-20 mb-4 md:mb-0 md:mr-4 rounded shadow-lg" /> */}
              <div className="text-center md:text-left">
                <h4 className="font-bold text-lg">{service.service_name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurances Section */}
      <div className="mb-12">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Insurances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hospital.Insurances?.map((insurance, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow">
              {/* <img src={insurance.image_url} alt={insurance.insurance_company} className="w-20 h-20 mb-4 md:mb-0 md:mr-4 rounded shadow-lg" /> */}
              <div className="text-center md:text-left">
                <h4 className="font-bold text-lg">{insurance.insurance_company}</h4>
                <p>Contact: {insurance.contact_info}</p>
                <p>Cashless: {insurance.cashless ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Packages Section */}
      <div className="mb-12">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Health Packages</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {hospital.HealthPackages?.map((packageItem, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow text-center">
              {/* <img src={packageItem.image_url} alt={packageItem.package_name} className="w-20 h-20 mb-4 rounded shadow-lg" /> */}
              <div>
                <h4 className="font-bold text-lg">{packageItem.package_name}</h4>
                <p className="text-gray-600 mb-2">{packageItem.package_description}</p>
                <p className="font-semibold text-green-600">₹{packageItem.package_price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default HospitalDetails;