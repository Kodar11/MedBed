import React, { useState } from "react";

function DoctorForm({ check }) {
  const [docNo, setDocNo] = useState(2);

  const [doctorData, setDoctorData] = useState([
    {
      id: "DOC"+1,
      name: '',
      specialization: '',
      qualification: '',
      experience_years: 0,
      availability: '',
      contact_info: '',
    },
  ]);

  const handleChange = (index, e) => {
    const updatedDoctorData = [...doctorData];
    updatedDoctorData[index][e.target.name] = e.target.value;
    setDoctorData(updatedDoctorData);
  };

  const addDoctorForm = () => {
    setDoctorData([
      ...doctorData,
      {
        id: "DOC"+docNo,
        name: '',
        specialization: '',
        qualification: '',
        experience_years: 0,
        availability: '',
        contact_info: '',
      },
    ]);

    setDocNo(docNo+1);
  };

  const deleteDoctorForm = (index) => {
    const updatedDoctorData = doctorData.filter((_, i) => i !== index);
    setDoctorData(updatedDoctorData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (check) {
      check(doctorData);
    } else {
      console.error("onSubmit is not defined.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 pt-4 bg-blue-100">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 ml-2">Doctor Information</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        {doctorData.map((doctor, index) => (
          <div key={index}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4 col-span-2">Doctor {index + 1}</h3>

              {/* Doctor Name */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`name_${index}`}>
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={doctor.name}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter doctor name"
                />
              </div>

              {/* Specialization */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`specialization_${index}`}>
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={doctor.specialization}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter specialization"
                />
              </div>

              {/* Qualification */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`qualification_${index}`}>
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={doctor.qualification}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter qualification"
                />
              </div>

              {/* Experience (Years) */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`experience_years_${index}`}>
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience_years"
                  value={doctor.experience_years}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter years of experience"
                />
              </div>

              {/* Availability (Hours) */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`availability_${index}`}>
                  Availability (Hours)
                </label>
                <input
                  type="text"
                  name="availability"
                  value={doctor.availability}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="e.g., 9 AM - 5 PM"
                />
              </div>

              {/* Contact Info */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`contact_info_${index}`}>
                  Contact Info
                </label>
                <input
                  type="text"
                  name="contact_info"
                  value={doctor.contact_info}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter contact info (optional)"
                />
              </div>

              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => deleteDoctorForm(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
            {index < doctorData.length - 1 && <hr className="my-6" />}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addDoctorForm}
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all"
          >
            Add Another Doctor
          </button>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow hover:bg-indigo-700 transition-all"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default DoctorForm;
