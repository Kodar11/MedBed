import React, { useState } from 'react';
import NavBar from './NavBar';
import HospitalList from './HospitalList';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query

    return (
        <div>
            {/* Pass search query state and update function to NavBar */}
            <NavBar setSearchQuery={setSearchQuery} />

            {/* Pass search query to HospitalList for filtering hospitals */}
            <HospitalList searchQuery={searchQuery} />
        </div>
    );
};

export default Search;
