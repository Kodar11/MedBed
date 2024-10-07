import React from 'react';

const HospitalPage = () => {
  return (
    <div className="bg-gray-100 p-32 pt-24">
      {/* Heading Section */}
      <section className="bg-blue-200 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 max-md:text-lg">
          Ushahkal Abhinav Institute of Medical Sciences (UAIMS) .
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
        <p className="text-gray-700 mb-4">
          Ushahkal Abhinav Institute of Medical Sciences (UAIMS) has been established as one of the most advanced Tertiary Health Care Centres in the region. This iconic hospital provides technologically advanced infrastructure, with highly skilled and experienced doctors, to deliver best treatment outcomes for the patients.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>
            A state-of-the-art Multi and Super speciality hospital, with a capacity of 350 beds, including 100 ICU beds, 15 state-of-the-art Operation Theatres, a dedicated Mother & Child block spread over an entire floor, 28 speciality & super speciality departments with 80 consultants and super consultants and growing.
          </li>
          <li>
            Spacious calming interiors and highest per bed area ratio, along with sophisticated high-end equipment, to qualify this tertiary hospital for international level infrastructure in the region.
          </li>
          <li>
            Services include 24 HOURS AMBULANCE & EMERGENCY Services, Hospital Kitchen and Cafeteria, 24 Hours Pharmacy & Advanced Pathology Laboratory.
          </li>
          <li>
            Cashless Mediclaim tie-ups, special schemes for deserving ones, ensuring no one is left out from the care and treatment they deserve.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default HospitalPage;
