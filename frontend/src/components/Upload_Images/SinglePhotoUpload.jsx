import React, { useState } from "react";

function SinglePhotoUpload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Upload a photo of your hospital</h2>
      <input
        type="file"
        onChange={handleImageChange}
        className="w-full p-3 text-teal-700 border-2 border-blue-500 rounded-md cursor-pointer"
      />
      {selectedImage && (
        <div className="mt-6">
          <img
            src={selectedImage}
            alt="Uploaded"
            className="w-full h-64 object-cover rounded-md shadow-lg"
          />
          <button
            onClick={removeImage}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition-all"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}

export default SinglePhotoUpload;
