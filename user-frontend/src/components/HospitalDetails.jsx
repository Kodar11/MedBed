import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faGlobe, faEnvelope, faHospital, faCertificate, faMedkit, faUserMd, faBed, faStethoscope, faHandHoldingMedical, faShieldAlt, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import Loading from './Loading'; // Import the Loading component
import NavBar from './NavBar';

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
    return <Loading />; // Use the Loading component instead of the text
  }

  if (!hospital) {
    return <p className="text-center py-12">No hospital data available.</p>;
  }

  return (
    <div>
      <NavBar/>
    <div className='min-h-screen bg-gray-100 py-12'>
     
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-teal-600 text-white py-8 px-8">
          <h2 className="text-4xl font-bold tracking-tight">{hospital.name}</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <InfoItem icon={faMapMarkerAlt} text={`${hospital.address}, ${hospital.city}, ${hospital.state}, ${hospital.zip_code}`} link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.name} ${hospital.address} ${hospital.city} ${hospital.state} ${hospital.zip_code}`)}`} />
            <InfoItem icon={faPhone} text={hospital.contact_number} />
            <InfoItem icon={faEnvelope} text={hospital.email} link={`mailto:${hospital.email}`} />
            <InfoItem icon={faGlobe} text={hospital.website} link={`http://${hospital.website}`} />
            <InfoItem icon={faHospital} text={`Type: ${hospital.type}`} />
            <InfoItem icon={faCertificate} text={`Accreditation: ${hospital.accreditation}`} />
          </div>

          <SectionWithIcon title="Doctors" icon={faUserMd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hospital.Doctors?.map((doctor, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-teal-700 mb-2">{doctor.name}</h4>
                  <p className="text-gray-600 font-medium mb-1">{doctor.specialization}</p>
                  <p className="text-gray-500 text-sm">{doctor.qualification}</p>
                  <p className="text-gray-500 text-sm mt-2">{doctor.experience_years} years of experience</p>
                </div>
              ))}
            </div>
          </SectionWithIcon>

          <SectionWithIcon title="Bed Information" icon={faBed}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hospital.BedInfos?.map((bedInfo, index) => (
                <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-lg">{bedInfo.bed_type}</h4>
                    <p>Total Beds: {bedInfo.total_beds}</p>
                    <p>Price: <span className="text-green-600">₹{bedInfo.price}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </SectionWithIcon>

          <SectionWithIcon title="Medical Equipments" icon={faStethoscope}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hospital.MedicalEquipments?.map((equipment, index) => (
                <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-lg">{equipment.equipment_name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </SectionWithIcon>

          <SectionWithIcon title="Services" icon={faHandHoldingMedical}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hospital.Services?.map((service, index) => (
                <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-lg">{service.service_name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </SectionWithIcon>

          <SectionWithIcon title="Insurances" icon={faShieldAlt}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hospital.Insurances?.map((insurance, index) => (
                <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-lg">{insurance.insurance_company}</h4>
                    <p>Contact: {insurance.contact_info}</p>
                    <p>Cashless: {insurance.cashless ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionWithIcon>

          <SectionWithIcon title="Health Packages" icon={faHeartbeat}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hospital.HealthPackages?.map((packageItem, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-teal-700 mb-2">{packageItem.package_name}</h4>
                  <p className="text-gray-600 mb-4 h-20 overflow-y-auto">{packageItem.package_description}</p>
                  <p className="font-semibold text-green-600 text-lg">₹{packageItem.package_price}</p>
                </div>
              ))}
            </div>
          </SectionWithIcon>
        </div>
      </div>
    </div>
    </div>
  );
};

const InfoItem = ({ icon, text, link }) => (
  <div className="flex items-center space-x-3 text-gray-700">
    <FontAwesomeIcon icon={icon} className="text-teal-500 w-5 h-5 flex-shrink-0" />
    {link ? (
      <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600">
        {text}
      </a>
    ) : (
      <span>{text}</span>
    )}
  </div>
);

const SectionWithIcon = ({ title, icon, children }) => (
  <div className="mb-12">
    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
      <FontAwesomeIcon icon={icon} className="mr-3 text-teal-500" />
      {title}
    </h3>
    {children}
  </div>
);

export default HospitalDetails;
