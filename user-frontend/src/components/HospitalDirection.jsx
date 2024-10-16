import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 

const HospitalDirection = () => {
  const { hospitalId } = useParams(); // Get hospitalId from the URL params
  const [location, setLocation] = useState(null); // State to store location
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (hospitalId) {
          console.log(`Fetching location for hospitalId: ${hospitalId}`);

          const response = await axios.get(`http://localhost:3000/api/v1/direction/locations/${hospitalId}`);
          setLocation(response.data.name); // Assuming response.data.name is the Google Maps URL

          setLoading(false); 
        } else {
          console.error("Hospital ID is missing.");
          setLoading(false); // Update loading state to false if hospitalId is missing
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setLoading(false); // Update loading state to false in case of error
      }
    };

    fetchLocation();
  }, [hospitalId]);

  if (loading) {
    return <p>Loading...</p>; // Display loading while fetching data
  }

  if (!location) {
    return <p>Location not found!</p>; // Handle case when no location is found
  }

  return (
    <div className="h-screen">
      <iframe
        src={location} // Dynamically set src to the fetched location
        className="w-full h-full border-0"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default HospitalDirection;
