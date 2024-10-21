import React, { useEffect, useState } from 'react';
import HospitalCard from '../components/HosptalCard';
import axios from 'axios';
import Loading from './Loading'; // Import the Loading component


const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hospital data from the backend
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/hospitals/getAllHospitals');
        setHospitals(response.data); // Assuming the API returns a list of hospitals
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching hospital data:', error);
        setLoading(false);
      }
    };

    // Fetch available beds initially and every 10 seconds
    const interval = setInterval(fetchHospitalData, 10000); // Fetch every 10 seconds

    fetchHospitalData();

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) {
    return <Loading />; // Use the Loading component instead of the text
  }

  return (
    <div>
      <div className="flex flex-col">
        {hospitals.slice(0, 5).map((hospital, index) => (
          <HospitalCard key={index} id={hospital.id} hospital={hospital} />
        ))}
      </div>
    </div>
  );
};

export default HospitalList;
