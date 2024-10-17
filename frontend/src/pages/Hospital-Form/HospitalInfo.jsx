import React, { useState, useEffect } from "react";

function HospitalInfo({data, check}) {

    const [hospitalData, setHospitalData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        contact_number: '',
        email: '',
        website: '',
        type: '',
        accreditation: '',
        account_number: '',
    });

    const handleChange = (e) => {
        setHospitalData({ ...hospitalData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (data) {
            setHospitalData(data); // Preload the form data when available
        }
    }, [data]);

    var stepNo = 1;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hospitalData.name || !hospitalData.email || !hospitalData.address) {
            alert('Please fill out all required fields!');
            return;
        }
        if (check) {  // Ensure onSubmit is defined before calling it
            stepNo = 2;
            check(hospitalData,stepNo);  
        } else {
            console.error("onSubmit is not defined.");
        }
    };


    return (
        <div className="max-w-7xl mx-auto mt-4 pt-4 bg-blue-100">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6 ml-2">Hospital Information</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-md rounded-lg p-8">
                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="name">Hospital Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={hospitalData.name} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter hospital name"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={hospitalData.email} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter email"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-semibold mb-2" htmlFor="address">Address</label>
                    <input 
                        type="text" 
                        name="address" 
                        value={hospitalData.address} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter address"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="city">City</label>
                    <input 
                        type="text" 
                        name="city" 
                        value={hospitalData.city} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter city"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="state">State</label>
                    <input 
                        type="text" 
                        name="state" 
                        value={hospitalData.state} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter state"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="zip_code">Postal Code</label>
                    <input 
                        type="number" 
                        name="zip_code" 
                        value={hospitalData.zip_code} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter postal code"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="contact_number">Contact Number</label>
                    <input 
                        type="number" 
                        name="contact_number" 
                        value={hospitalData.contact_number} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter contact number"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="website">Website</label>
                    <input 
                        type="text" 
                        name="website" 
                        value={hospitalData.website} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter website URL"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="type">Type</label>
                    <select 
                        name="type" 
                        value={hospitalData.type} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    >
                        <option value="">Select hospital type</option>
                        <option value="government">Government</option>
                        <option value="private">Private</option>
                        <option value="multi-specialty">Multi-specialty</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="accreditation">Accreditation</label>
                    <input 
                        type="text" 
                        name="accreditation" 
                        value={hospitalData.accreditation} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter accreditation (if any)"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2" htmlFor="account_number">Bank Account Number</label>
                    <input 
                        type="number" 
                        name="account_number" 
                        value={hospitalData.account_number} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter bank account number"
                    />
                </div>

                <div className="col-span-2">
                    <button 
                        type="submit" 
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow hover:bg-indigo-700 transition-all"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}

export default HospitalInfo;
