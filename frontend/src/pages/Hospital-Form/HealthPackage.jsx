import React, { useState, useEffect } from "react";

function HealthPackage({ data, check }) {
  const [packageID, setPackageID] = useState(1);

  const [packageData, setPackageData] = useState([
    {
      id: 'HP' + packageID,
      package_name: '',
      package_description: '',
      package_price: '',
    },
  ]);

  useEffect(() => {
    if (data) {
      setPackageData(data); // Preload the form data when available
    }
}, [data]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedData = [...packageData];
    updatedData[index][name] = value;
    setPackageData(updatedData);
  };

  const addHealthPackageForm = () => {
    setPackageData([
      ...packageData,
      {
        id: 'HP' + (packageID + 1),
        package_name: '',
        package_description: '',
        package_price: '',
      },
    ]);
    setPackageID(packageID + 1);
  };

  const deleteHealthPackageForm = (index) => {
    const updatedData = packageData.filter((_, i) => i !== index);
    setPackageData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(packageData);
    check(packageData,8);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-4 pt-4 bg-blue-100">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 ml-2">Health Package Information</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          {packageData.map((data, index) => (
            <div key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`package_name_${index}`}>
                    Package Name
                  </label>
                  <input
                    type="text"
                    name="package_name"
                    value={data.package_name}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter package name"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`package_price_${index}`}>
                    Package Price
                  </label>
                  <input
                    type="number"
                    name="package_price"
                    value={data.package_price}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter package price"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`package_description_${index}`}>
                    Package Description
                  </label>
                  <textarea
                    name="package_description"
                    value={data.package_description}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter package description"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deleteHealthPackageForm(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {index < packageData.length - 1 && <hr className="my-6" />}
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addHealthPackageForm}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all"
            >
              Add Another Package
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
    </>
  );
}

export default HealthPackage;
