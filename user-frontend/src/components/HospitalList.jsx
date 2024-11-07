import React, { useEffect, useState } from 'react';
import HospitalCard from '../components/HosptalCard';
import axios from 'axios';
import Loading from './Loading'; // Import the Loading component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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

    fetchHospitalData(); // Fetch initial hospital data
  }, []);

  useEffect(() => {
    // Fetch available beds data from the backend every 10 seconds
    const fetchAvailableBeds = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users/getAvailbleBeds');
        setHospitalData(response.data); // Assuming API returns data in the format: { hospitalId: availableBeds }
      } catch (error) {
        console.error('Error fetching available beds:', error);
      }
    };

    fetchAvailableBeds(); // Fetch initial available beds data

    // Fetch available beds initially and every 10 seconds
    const interval = setInterval(fetchAvailableBeds, 5000); // Fetch every 10 seconds

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
      {/* Updated Search Input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full p-4 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </span>
        </div>
      </div>

      {/* City Filter Dropdown */}
      <div className="mb-8 flex justify-end">
        <div className="relative">
          <select
            id="city-filter"
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleCityChange}
            value={city}
          >
            <option value="">All Cities</option>
            <option value="Sangli">Sangli</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Ratnagiri">Ratnagiri</option>
            <option value="Pune">Pune</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="flex flex-col space-y-4">
        {paginatedHospitals.map((hospital, index) => (
          <HospitalCard 
            key={hospital.hospital.id} 
            hospital={hospital} 
            availableBeds={hospitalData[hospital.hospital.id] > 900 ? null : hospitalData[hospital.hospital.id]}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
              page === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          {[...Array(Math.min(5, Math.ceil(filteredHospitals.length / hospitalsPerPage))).keys()].map((i) => (
            <button
              key={i}
              className={`relative inline-flex items-center px-4 py-2 border ${
                page === i + 1
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              } text-sm font-medium`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
              page === Math.ceil(filteredHospitals.length / hospitalsPerPage)
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === Math.ceil(filteredHospitals.length / hospitalsPerPage)}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default HospitalList;
