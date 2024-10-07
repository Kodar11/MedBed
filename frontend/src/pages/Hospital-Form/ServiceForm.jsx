import React, { useState } from "react";

function ServiceForm({check}) {
  const [serviceID, setServiceID] = useState(2);

  const [serviceData, setServiceData] = useState([
    {
      id: 'SRV1',
      service_name: '',
      description: '',
      availability: false,
    },
  ]);

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedServices = [...serviceData];
    updatedServices[index][name] = type === 'checkbox' ? checked : value;
    setServiceData(updatedServices);
  };

  const addServiceForm = () => {
    setServiceData([
      ...serviceData,
      {
        id: 'SRV'+serviceID,
        service_name: '',
        description: '',
        availability: false,
      },
    ]);

    setServiceID(serviceID+1);
  };

  const deleteServiceForm = (index) => {
    const updatedServices = serviceData.filter((_, i) => i !== index);
    setServiceData(updatedServices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(serviceData); 
    check(serviceData);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-4 pt-4 bg-blue-100">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 ml-2">Service Information</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          {serviceData.map((service, index) => (
            <div key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`service_name_${index}`}>
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="service_name"
                    value={service.service_name}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter service name"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`description_${index}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={service.description}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter service description (optional)"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2">Availability</label>
                  <input
                    type="checkbox"
                    name="availability"
                    checked={service.availability}
                    onChange={(e) => handleChange(index, e)}
                    className="mr-2"
                  />
                  <span>{service.availability ? 'Available' : 'Unavailable'}</span>
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deleteServiceForm(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {index < serviceData.length - 1 && <hr className="my-6" />}
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addServiceForm}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all"
            >
              Add Another Service
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

export default ServiceForm;
