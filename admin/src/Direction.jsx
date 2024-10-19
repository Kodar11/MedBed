import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Direction = () => {

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasChanged, setHasChanged] = useState(true);
  const [locations, setLocations] = useState({}); // Change to an object to store locations for each hospital


  // /store-end-location 

  const handleAcknowledge = async (hospitalId) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const location = locations[hospitalId] || ''; // Get the specific location for the hospital

      await axios.post('http://localhost:3000/api/v1/direction/store-end-location', {
        id: hospitalId, end: location
      }, 
      // {
      //   headers: {
      //     Authorization: Bearer ${accessToken},
      //   }, withCredentials: true
      // }
    );

      setHasChanged(!hasChanged);

      // AlertBox(1, "Problem acknowledged !!")
    } catch (error) {

      console.error('Error completing the task:', error);
    }
  };

  // const checkLocation = async () => {
  //   setLoading(true); // Start loading

  //   try {
  //     const response = await axios.post('http://localhost:3000/api/v1/location/check', {
  //       id: hospitalId, // Passing the hospital ID to the backend
  //     });

  //     // Based on the response, set locationSet state
  //     if (response.status === 200) {
  //       setLocationSet(true);
  //     } else {
  //       setLocationSet(false);
  //     }

  //     setError(null); // Clear error state
  //   } catch (error) {
  //     console.error('Error checking location:', error);
  //     setError('Error occurred while checking location');
  //   }

  //   setLoading(false); // Stop loading
  // };

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

    fetchHospitalData();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Display loading message while data is being fetched
  }

    const handleChange = (e, hospitalId) => {
      setLocations({
        ...locations,
        [hospitalId]: e.target.value // Update the specific hospital's location
      });
    };

  return (
    <div className="max-w-5xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">

      <div className=" w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 mb-6 lg:mb-0 max-sm:p-2 max-sm:mb-4">
        <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:text-center max-sm:px-2">
          Hospitals
        </h3>
        <div className="max-h-[26rem] overflow-y-auto p-4 max-sm:p-2">
          {hospitals.length > 0 ? (
            <ul className="space-y-4 max-sm:space-y-2">
              {hospitals.map((hs, index) => (
                <li key={hs._id} className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2">
                  <div className="flex justify-between items-center max-sm:flex-col">
                    <div className="text-left max-sm:mb-2">
                      <h4 className="font-semibold text-lg max-sm:text-base text-left ">Name: {hs.hospital.name}</h4>
                      {/* <span>{hs.hospital.id}</span> */}
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={locations[hs.hospital.id] || ''}
                        onChange={(e) => handleChange(e, hs.hospital.id)} // Pass the hospital ID to handleChange
                        className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 my-1"
                      />
                    </div>
                    {/* {(task.acknowledge_at == "") && ( */}
                    <button
                      onClick={() => handleAcknowledge(hs.hospital.id)}
                      className="bg-green-500 text-white text-base px-4 py-2 rounded-lg hover:bg-green-600 max-sm:px-2 max-sm:py-1 "
                    >
                      Set Location
                    </button>
                    {/* )} */}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 max-sm:text-sm">No hospitals.</p>
          )}
        </div>
      </div>
    </div>

  );
};

export default Direction;