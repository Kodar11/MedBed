import React, { useState } from 'react';

const HospitalHome = () => {
  const [formData, setFormData] = useState({
    service: true,
    noOfBeds: '',
    depositMoney: ''
  });

  const [patients, setpatients] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = () => {
    
    alert("Updated!");
  };

  return (
    <div className='min-h-screen flex flex-col items-center'>
      <div className=" lg:w-1/2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 mb-6 lg:mb-0 max-sm:p-2 max-sm:mb-4">
              <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:text-center max-sm:px-2">
                Patients
              </h3>
              <div className="max-h-[26rem] overflow-y-auto p-4 max-sm:p-2">
                
                  <ul className="space-y-4 max-sm:space-y-2">
                    {patients.map((patient) => (
                      <li key={patient._id} className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2">
                        <div className="flex justify-between items-center max-sm:flex-col">
                          <div className="text-left max-sm:mb-2">
                            <h4 className="font-semibold text-lg max-sm:text-base text-left ">Problem: {patient.issue}</h4>
                            <p className="text-gray-600 max-sm:text-sm text-left">Description: {patient.description}</p>
                            <p className="text-gray-600 max-sm:text-sm text-left">Address: {patient.address}</p>
                          </div>
                          {(patient.acknowledge_at == "") && (
                              <button
                                onClick={() => handleAcknowledge(patient._id)}
                                className="bg-green-500 text-white text-base px-4 py-2 rounded-lg hover:bg-green-600 max-sm:px-2 max-sm:py-1 "
                              >
                                Arrived
                              </button>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
               
              </div>
            </div>

    
    

    </div>
  );
};

export default HospitalHome;




