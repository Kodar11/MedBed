import React, { useState, useEffect } from "react";

function InsuranceForm({ data ,check }) {
  const [insuranceID, setInsuranceID] = useState(2);

  const [insuranceData, setInsuranceData] = useState([
    {
      id: 'INS1',
      insurance_company: '',
      contact_info: '',
      insurance_type_id: '',
      insurance_type: '',
      cashless: false,
    },
  ]);

//   useEffect(() => {
//     if (data) {
//       setInsuranceData(data); // Preload the form data when available
//     }
// }, [data]);

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedData = [...insuranceData];
    updatedData[index][name] = type === 'checkbox' ? checked : value;
    setInsuranceData(updatedData);
  };

  const addInsuranceForm = () => {
    setInsuranceData([
      ...insuranceData,
      {
        id: 'INS' + insuranceID,
        insurance_company: '',
        contact_info: '',
        insurance_type_id: '',
        insurance_type: '',
        cashless: false,
      },
    ]);
    setInsuranceID(insuranceID + 1);
  };

  const deleteInsuranceForm = (index) => {
    const updatedData = insuranceData.filter((_, i) => i !== index);
    setInsuranceData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(insuranceData); 
    check(insuranceData,7);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-4 pt-4 bg-blue-100">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 ml-2">Insurance Information</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          {insuranceData.map((data, index) => (
            <div key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`insurance_company_${index}`}>
                    Insurance Company
                  </label>
                  <input
                    type="text"
                    name="insurance_company"
                    value={data.insurance_company}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter company name"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`insurance_type_id_${index}`}>
                    Insurance Type ID
                  </label>
                  <input
                    type="text"
                    name="insurance_type_id"
                    value={data.insurance_type_id}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter insurance type ID"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`contact_info_${index}`}>
                    Contact Info
                  </label>
                  <input
                    type="text"
                    name="contact_info"
                    value={data.contact_info}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter contact info (optional)"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`insurance_type_${index}`}>
                    Insurance Type
                  </label>
                  <input
                    type="text"
                    name="insurance_type"
                    value={data.insurance_type}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter insurance type"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-2" htmlFor={`cashless_${index}`}>
                    Cashless
                  </label>
                  <input
                    type="checkbox"
                    name="cashless"
                    checked={data.cashless}
                    onChange={(e) => handleChange(index, e)}
                    className="w-6 h-6"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deleteInsuranceForm(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {index < insuranceData.length - 1 && <hr className="my-6" />}
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addInsuranceForm}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all"
            >
              Add Another Insurance
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

export default InsuranceForm;
