import React, { useState } from "react";

function SinglePhotoUpload({ onSingleImageUpload }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setSelectedImage(imageUrl);
            onSingleImageUpload(e.target.files[0]); // Send file back to parent
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        onSingleImageUpload(null); // Clear image in parent
    };

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Upload a photo of your hospital</h2>
            <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-3 text-teal-700 border-2 border-teal-500 rounded-md cursor-pointer"
            />
            {selectedImage && (
                <div className="relative mt-4">
                    <img src={selectedImage} alt="Selected" className="w-full h-64 object-cover rounded-md shadow-lg" />
                    <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full shadow hover:bg-red-600 transition-all"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}

export default SinglePhotoUpload;
