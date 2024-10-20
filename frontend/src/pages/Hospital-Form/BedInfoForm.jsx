import React, { useState, useEffect } from "react";

function BedInfoForm({ data, check }) {

  const [bedNo, setBedNo] = useState(2);

  const [bedData, setBedData] = useState([
    {
      id:"BED"+1,
      total_beds: 0,
      bed_type: '',
      available_beds: 0,
      price: '',
    },
  ]);

  useEffect(() => {
    if (data) {
      setBedData(data); // Preload the form data when available
      setBedNo(data.length + 1); // Adjust bed number based on preloaded data
    }
  }, [data]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBedData = [...bedData];
    
    if (name === "total_beds" || name === "available_beds") {
      updatedBedData[index][name] = parseInt(value, 10) || 0;
  
      // Ensure available_beds is not greater than total_beds
      if (name === "total_beds" && updatedBedData[index].available_beds > updatedBedData[index].total_beds) {
        updatedBedData[index].available_beds = updatedBedData[index].total_beds;
      }
    } else if (name === "price") {
      updatedBedData[index][name] = parseFloat(value) || 0;
    } else {
      updatedBedData[index][name] = value;
    }
  
    setBedData(updatedBedData);
  };
  

  const addBedForm = () => {
    setBedData([
      ...bedData,
      {
        id: "BED"+bedNo,
        total_beds: 0,
        bed_type: '',
        available_beds: 0,
        price: '',
      },
    ]);

    setBedNo(bedNo + 1);
  };

  const deleteBedForm = (index) => {
    const updatedBedData = bedData.filter((_, i) => i !== index);
    setBedData(updatedBedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (check) {
      check(bedData,3);
    } else {
      console.error("onSubmit is not defined.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 pt-4 bg-blue-100">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 ml-2">Bed Information</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        {bedData.map((bed, index) => (
          <div key={index}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4 col-span-2">Bed Type {index + 1}</h3>

              {/* Total Beds */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`total_beds_${index}`}>
                  Total Beds
                </label>
                <input
                  type="number"
                  name="total_beds"
                  value={bed.total_beds}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter total beds"
                />
              </div>

              {/* Bed Type */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`bed_type_${index}`}>
                  Bed Type
                </label>
                <select
                  name="bed_type"
                  value={bed.bed_type}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select bed type</option>
                  <option value="general">General</option>
                  <option value="ICU">ICU</option>
                  <option value="maternity">Maternity</option>
                </select>
              </div>

              {/* Available Beds */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`available_beds_${index}`}>
                  Available Beds
                </label>
                <input
                  type="number"
                  name="available_beds"
                  value={bed.available_beds}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter available beds"
                />
              </div>

              {/* Price */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-2" htmlFor={`price_${index}`}>
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={bed.price}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter price per day"
                />
              </div>

              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => deleteBedForm(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
            {index < bedData.length - 1 && <hr className="my-6" />}
          </div>
        ))}

      {/* {bedData.length>0 && bedData.map((index) => ( */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addBedForm}
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all"
          >
            Add Another Bed Type
          </button>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow hover:bg-indigo-700 transition-all"
          >
            Submit
          </button>
        </div>
      {/* ))} */}
      </form>
    </div>
  );
}

export default BedInfoForm;
