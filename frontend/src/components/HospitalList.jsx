import React from 'react';
import './Home.css';
import HospitalCard from './HospitalCard';

const HospitalList = () => {
    const hospitals = [
      {
        name: "Ushakal Abhinav Multisuperspeciality Hospital",
        location: "Dhanji Road, Sangli 416416, India",
        phone: "+7064575293",
        hours: "Open 24 hours",
        rating: "4.8",
        reviews: "1,660"
      },
      {
        name: "Ushakal Abhinav Multisuperspeciality Hospital",
        location: "Dhanji Road, Sangli 416416, India",
        phone: "+7064575293",
        hours: "Open 24 hours",
        rating: "4.8",
        reviews: "1,660"
      },
      // Add more hospital objects here as needed
    ];
  
    return (
      <div className="flex flex-col">
        {hospitals.map((hospital, index) => (
          <HospitalCard key={index} {...hospital} />
          
        ))}
        
      </div>
    );
  };

export default HospitalList