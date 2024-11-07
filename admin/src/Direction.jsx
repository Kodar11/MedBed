// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const Direction = () => {

//   const [hospitals, setHospitals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hasChanged, setHasChanged] = useState(true);
//   const [locations, setLocations] = useState({}); // Change to an object to store locations for each hospital


//   // /store-end-location 

//   const handleAcknowledge = async (hospitalId) => {
//     const accessToken = localStorage.getItem('accessToken');

//     try {
//       const location = locations[hospitalId] || ''; // Get the specific location for the hospital

//       await axios.post('https://medbed.onrender.com/api/v1/direction/store-end-location', {
//         id: hospitalId, end: location
//       }, 
//       // {
//       //   headers: {
//       //     Authorization: Bearer ${accessToken},
//       //   }, withCredentials: true
//       // }
//     );

//       setHasChanged(!hasChanged);

//       // AlertBox(1, "Problem acknowledged !!")
//     } catch (error) {

//       console.error('Error completing the task:', error);
//     }
//   };

//   const checkLocation = async () => {
//     setLoading(true); // Start loading

//     try {
//       const response = await axios.post('https://medbed.onrender.com/api/v1/location/check', {
//         id: hospitalId, // Passing the hospital ID to the backend
//       });

//       // Based on the response, set locationSet state
//       if (response.status === 200) {
//         setLocationSet(true);
//       } else {
//         setLocationSet(false);
//       }

//       setError(null); // Clear error state
//     } catch (error) {
//       console.error('Error checking location:', error);
//       setError('Error occurred while checking location');
//     }

//     setLoading(false); // Stop loading
//   };

//   useEffect(() => {
//     // Fetch hospital data from the backend
//     const fetchHospitalData = async () => {
//       try {
//         const response = await axios.get('https://medbed.onrender.com/api/v1/hospitals/getAllHospitals');
//         setHospitals(response.data); // Assuming the API returns a list of hospitals
//         setLoading(false);
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error fetching hospital data:', error);
//         setLoading(false);
//       }
//     };

//     fetchHospitalData();
//   }, []);

//   if (loading) {
//     return <p>Loading...</p>; // Display loading message while data is being fetched
//   }

//     const handleChange = (e, hospitalId) => {
//       setLocations({
//         ...locations,
//         [hospitalId]: e.target.value // Update the specific hospital's location
//       });
//     };

//   return (
//     <div className="max-w-5xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">

//       <div className=" w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 mb-6 lg:mb-0 max-sm:p-2 max-sm:mb-4">
//         <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:text-center max-sm:px-2">
//           Hospitals
//         </h3>
//         <div className="max-h-[26rem] overflow-y-auto p-4 max-sm:p-2">
//           {hospitals.length > 0 ? (
//             <ul className="space-y-4 max-sm:space-y-2">
//               {hospitals.map((hs, index) => (
//                 <li key={hs._id} className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2">
//                   <div className="flex justify-between items-center max-sm:flex-col">
//                     <div className="text-left max-sm:mb-2">
//                       <h4 className="font-semibold text-lg max-sm:text-base text-left ">Name: {hs.hospital.name}</h4>
//                       {/* <span>{hs.hospital.id}</span> */}
//                       <input
//                         type="text"
//                         name="name"
//                         placeholder="Name"
//                         value={locations[hs.hospital.id] || ''}
//                         onChange={(e) => handleChange(e, hs.hospital.id)} // Pass the hospital ID to handleChange
//                         className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 my-1"
//                       />
//                     </div>
//                     {/* {(task.acknowledge_at == "") && ( */}
//                     <button
//                       onClick={() => handleAcknowledge(hs.hospital.id)}
//                       className="bg-green-500 text-white text-base px-4 py-2 rounded-lg hover:bg-green-600 max-sm:px-2 max-sm:py-1 "
//                     >
//                       Set Location
//                     </button>
//                     {/* )} */}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-600 max-sm:text-sm">No hospitals.</p>
//           )}
//         </div>
//       </div>
//     </div>

//   );
// };

// export default Direction;





import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Direction = () => {
  const [hospitals, setHospitals] = useState([]); // All hospitals
  const [hospitalsWithoutLocation, setHospitalsWithoutLocation] = useState([]); // Hospitals without location set
  const [loading, setLoading] = useState(true);
  const [hasChanged, setHasChanged] = useState(false); // Track state change
  const [locations, setLocations] = useState({}); // Store locations for hospitals

  // Function to check if a location is set for a specific hospital
  const checkLocationForHospital = async (hospitalId) => {
    try {
      const response = await axios.get(`https://medbed.onrender.com/api/v1/location/check-location/${hospitalId}`);
      return response.status === 200; // Return true if location is set, otherwise false
    } catch (error) {
      console.error(`Error checking location for hospital ${hospitalId}:`, error);
      return false;
    }
  };

  // Fetch all hospitals and filter those without a location set
  const fetchHospitalsWithoutLocation = async () => {
    setLoading(true);

    try {
      const response = await axios.get('https://medbed.onrender.com/api/v1/hospitals/getAllHospitals');
      const allHospitals = response.data;

      // Filter hospitals to only include those without a location set
      const hospitalsWithoutLocation = [];
      for (let hospital of allHospitals) {
        const isLocationSet = await checkLocationForHospital(hospital.hospital.id);
        if (!isLocationSet) {
          hospitalsWithoutLocation.push(hospital);
        }
      }

      setHospitals(allHospitals); // Store all hospitals
      setHospitalsWithoutLocation(hospitalsWithoutLocation); // Store hospitals without location
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoading(false);
    }
  };

  // Handle setting the location for a hospital
  const handleAcknowledge = async (hospitalId) => {
    try {
      const location = locations[hospitalId] || ''; // Get location for the specific hospital

      await axios.post('https://medbed.onrender.com/api/v1/direction/store-end-location', {
        id: hospitalId,
        end: location,
      });

      setHasChanged(!hasChanged); // Trigger a re-render if needed
    } catch (error) {
      console.error('Error setting the location:', error);
    }
  };

  // Handle location input changes
  const handleChange = (e, hospitalId) => {
    setLocations({
      ...locations,
      [hospitalId]: e.target.value, // Update the location for the specific hospital
    });
  };

  useEffect(() => {
    // Fetch hospitals without a location set on component mount and when hasChanged changes
    fetchHospitalsWithoutLocation();
  }, [hasChanged]);

  if (loading) {
    return <p>Loading...</p>; // Display loading message while data is being fetched
  }

  return (
    <div className="max-w-5xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 mb-6 lg:mb-0 max-sm:p-2 max-sm:mb-4">
        <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:text-center max-sm:px-2">
          Hospitals Without Location
        </h3>
        <div className="max-h-[26rem] overflow-y-auto p-4 max-sm:p-2">
          {hospitalsWithoutLocation.length > 0 ? (
            <ul className="space-y-4 max-sm:space-y-2">
              {hospitalsWithoutLocation.map((hs, index) => (
                <li key={hs.id} className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2">
                  <div className="flex justify-between items-center max-sm:flex-col">
                    <div className="text-left max-sm:mb-2">
                      <h4 className="font-semibold text-lg max-sm:text-base text-left">
                        Name: {hs.hospital.name}
                      </h4>
                      <input
                        type="text"
                        placeholder="Enter location"
                        value={locations[hs.hospital.id] || ''}
                        onChange={(e) => handleChange(e, hs.hospital.id)}
                        className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 my-1"
                      />
                    </div>
                    <button
                      onClick={() => handleAcknowledge(hs.hospital.id)}
                      className="bg-green-500 text-white text-base px-4 py-2 rounded-lg hover:bg-green-600 max-sm:px-2 max-sm:py-1"
                    >
                      Set Location
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 max-sm:text-sm">All hospitals have their location set.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Direction;
