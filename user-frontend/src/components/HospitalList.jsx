import React, { useEffect, useState } from 'react';
import HospitalCard from '../components/HosptalCard';
import axios from 'axios';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState({}); // To store available beds for each hospital

  useEffect(() => {
    // Fetch hospital data from the backend
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/hospitals/getAllHospitals');
        setHospitals(response.data); // Assuming the API returns a list of hospitals
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hospital data:', error);
        setLoading(false);
      }
    };

    // Fetch available beds data from the backend every 10 seconds
    const fetchAvailableBeds = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users/getAvailbleBeds');
        setHospitalData(response.data); // Assuming API returns data in the format: { hospitalId: availableBeds }
      } catch (error) {
        console.error('Error fetching available beds:', error);
      }
    };

    fetchHospitalData(); // Fetch initial hospital data
    fetchAvailableBeds(); // Fetch initial available beds data

    const interval = setInterval(fetchAvailableBeds, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount

  }, []);

  if (loading) {
    return <p>Loading...</p>; // Display loading message while data is being fetched
  }

  console.log(hospitalData);
  


  return (
    <div>
      <div className="flex flex-col">
        {hospitals.slice(0, 5).map((hospital) => (
          
          <HospitalCard 
            key={hospital.hospital.id} 
            hospital={hospital} 
            availableBeds={hospitalData[hospital.hospital.id]} // Use hospitalData[hospital.id] directly
          />
        ))}
      </div>
    </div>
  );
};

export default HospitalList;
