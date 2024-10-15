import React, { useState } from "react";

function MultiplePhotoUpload({ onMultipleImagesUpload }) {
    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const imageUrls = filesArray.map((file) => URL.createObjectURL(file));
            setSelectedImages((prevImages) => prevImages.concat(imageUrls));
            onMultipleImagesUpload(filesArray); // Send files back to parent
        }
    };

    const removeImage = (image, index) => {
        const newImages = selectedImages.filter((img, i) => i !== index);
        setSelectedImages(newImages);
        onMultipleImagesUpload(newImages); // Update images in parent
    };

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Upload photos about your hospital</h2>
            <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full p-3 text-indigo-700 border-2 border-indigo-500 rounded-md cursor-pointer"
            />
            {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                            <img src={image} alt={`Uploaded ${index}`} className="w-full h-32 object-cover rounded-md shadow-lg" />
                            <button
                                onClick={() => removeImage(image, index)}
                                className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full shadow hover:bg-red-600 transition-all"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiplePhotoUpload;
