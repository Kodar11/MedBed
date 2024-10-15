import React from "react";
import { useState } from "react";
import SinglePhotoUpload from "../../components/Upload_Images/SinglePhotoUpload";
import MultiplePhotoUpload from "../../components/Upload_Images/MultiplePhotoUpload";

function UploadImages({ onImagesSubmit }) {
  const [singleImage, setSingleImage] = useState(null);
  const [multipleImages, setMultipleImages] = useState([]);

  const handleSingleImageUpload = (image) => {
      setSingleImage(image);
  };

  const handleMultipleImagesUpload = (images) => {
      setMultipleImages(images);
  };

  // Send both single and multiple images back to the parent component
  const handleSubmit = () => {
      // Ensure the images are sent with correct field names
      onImagesSubmit('hospitalPhoto', [singleImage]);  // Send the single image with 'hospitalPhoto'
      onImagesSubmit('hospitalImages', multipleImages); // Send the multiple images with 'hospitalImages'
  };

  return (
      <>
          <SinglePhotoUpload onSingleImageUpload={handleSingleImageUpload} />
          <MultiplePhotoUpload onMultipleImagesUpload={handleMultipleImagesUpload} />
          <button onClick={handleSubmit} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition-all">
              Submit Images
          </button>
      </>
  );
}


export default UploadImages;
