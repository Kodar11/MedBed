import React, { useEffect, useState } from 'react';
import HospitalCard from '../components/HosptalCard';
import axios from 'axios';
import Loading from './Loading'; // Import the Loading component

const HospitalList = () => {
  const [allHospitals, setAllHospitals] = useState([]); // Store all hospitals
  const [filteredHospitals, setFilteredHospitals] = useState([]); // Store filtered hospitals
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Track current page
  const [city, setCity] = useState(''); // Track selected city filter
  const [searchQuery, setSearchQuery] = useState(''); // Track search query
  const hospitalsPerPage = 5; // Number of hospitals to show per page
  const [hospitalData, setHospitalData] = useState({}); // To store available beds for each hospital

  useEffect(() => {

    const fetchHospitalData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/hospitals/getAllHospitals');
        setAllHospitals(response.data); 
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

    // Fetch available beds initially and every 10 seconds
    const interval = setInterval(fetchHospitalData, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // Apply city and search query filters
    const filtered = allHospitals.filter(hospital => {
      const matchesCity = city ? hospital.hospital.city.toLowerCase() === city.toLowerCase() : true;
      const matchesSearch = searchQuery ? hospital.hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchesCity && matchesSearch;
    });
  
    setFilteredHospitals(filtered);
  }, [city, searchQuery, allHospitals]); // Re-run filtering when city, search query, or data changes

  // Calculate hospitals for current page
  const paginatedHospitals = filteredHospitals.slice(
    (page - 1) * hospitalsPerPage,
    page * hospitalsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredHospitals.length / hospitalsPerPage)) {
      setPage(newPage);
    }
  };

  // Handle city filter change
  const handleCityChange = (e) => {
    setCity(e.target.value); // Update selected city
    setPage(1); // Reset to the first page after applying a filter
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
    setPage(1); // Reset to the first page after search
  };

  if (loading) {
    return <Loading />; // Use the Loading component instead of the text
  }

  return (
    <div className="container mx-auto p-6">
      {/* Search Input */}
      <div className="mb-4 text-center \">
        <input
          type="text"
          placeholder="Search hospital by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2  px-12 border border-blue-500 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* City Filter Dropdown */}
      <div className="mb-8 text-center">
        <label htmlFor="city-filter" className="text-lg font-semibold text-gray-700">Filter by City:</label>
        <select
          id="city-filter"
          className="ml-2 p-2 rounded border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleCityChange}
          value={city}
        >
          <option value="">All Cities</option>
          <option value="Sangli">Sangli</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Ratnagiri">Ratnagiri</option>
          <option value="Pune">Pune</option>
          {/* Add more city options based on your data */}
        </select>
      </div>

      {/* Hospital Cards */}
      <div className="flex flex-col">
        {paginatedHospitals.map((hospital, index) => (
          <HospitalCard 
            key={hospital.hospital.id} 
            hospital={hospital} 
            availableBeds={hospitalData[hospital.hospital.id]} // Use hospitalData[hospital.id] directly
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-10">
        <button
          className={`px-4 py-2 text-white font-bold rounded ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="text-lg font-semibold text-gray-700">
          Page {page} of {Math.ceil(filteredHospitals.length / hospitalsPerPage)}
        </span>

        <button
          className={`px-4 py-2 text-white font-bold rounded ${page === Math.ceil(filteredHospitals.length / hospitalsPerPage) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={() => handlePageChange(page + 1)}
          disabled={page === Math.ceil(filteredHospitals.length / hospitalsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HospitalList;
