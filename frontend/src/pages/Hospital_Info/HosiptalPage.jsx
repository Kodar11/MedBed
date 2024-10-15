import React from 'react';

const HospitalPage = () => {
  return (
    <div className="bg-gray-100 p-32 pt-24">
      {/* Heading Section */}
      <section className="bg-blue-200 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 max-md:text-lg">
          {/* Ushahkal Abhinav Institute of Medical Sciences (UAIMS) . */}
          
        </h1>
      </section>

      {/* Image Section */}
      <section className="flex justify-center mb-8">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLW-1VPPZX7gNHbxYFj-W-Am5DBvrASUJUzA&s" 
          alt="Largest Multi Super Speciality Hospital" 
          className="rounded-lg shadow-lg w-full max-w-5xl"
        />
      </section>

      {/* Information Section */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        
      </section>
    </div>
  );
};

export default HospitalPage;
