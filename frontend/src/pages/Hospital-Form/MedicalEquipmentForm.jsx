import React, { useState, useEffect } from "react";

function MedicalEquipmentForm({data, check}) {
  const [equiID, setEquiID] = useState(2);

  const [equipmentData, setEquipmentData] = useState([
    {
      id: 'EQUI'+1,
      equipment_name: '',
      equipment_type: '',
      availability: false,
      certification_status: '',
    },
  ]);

  useEffect(() => {
    if (data) {
      setEquipmentData(data); // Preload the form data when available
    }
}, [data]);

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedData = [...equipmentData];
    updatedData[index][name] = type === 'checkbox' ? checked : value;
    setEquipmentData(updatedData);
  };

  const addEquipmentForm = () => {
    setEquipmentData([
      ...equipmentData,
      {
        id: 'EQUI'+equiID,
        equipment_name: '',
        equipment_type: '',
        availability: false,
        certification_status: '',
      },
    ]);

    setEquiID(equiID+1);
  };

  const deleteEquipmentForm = (index) => {
    const updatedData = equipmentData.filter((_, i) => i !== index);
    setEquipmentData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(equipmentData); 
    check(equipmentData,5);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-4 pt-4 bg-blue-100">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 ml-2">Medical Equipment Information</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          {equipmentData.map((data, index) => (
            <div key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`equipment_name_${index}`}>Equipment Name</label>
                  <input
                    type="text"
                    name="equipment_name"
                    value={data.equipment_name}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter equipment name"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`equipment_type_${index}`}>Equipment Type</label>
                  <input
                    type="text"
                    name="equipment_type"
                    value={data.equipment_type}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter equipment type"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2">Availability</label>
                  <input
                    type="checkbox"
                    name="availability"
                    checked={data.availability}
                    onChange={(e) => handleChange(index, e)}
                    className="mr-2"
                  />
                  <span>{data.availability ? 'Available' : 'Unavailable'}</span>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`certification_status_${index}`}>Certification Status</label>
                  <input
                    type="text"
                    name="certification_status"
                    value={data.certification_status}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="e.g., up-to-date, pending"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deleteEquipmentForm(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {index < equipmentData.length - 1 && <hr className="my-6" />}
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addEquipmentForm}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all"
            >
              Add Another Equipment
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow hover:bg-indigo-700 transition-all"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MedicalEquipmentForm;
