// import './App.css';
import React, { useState } from 'react';
// import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // const url = 'https://medbed.onrender.com/uploadFile';
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: function(progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    };

    // axios.post(url, formData, config)
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error uploading file: ", error);
    //   });
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>React File Upload with Progress</h1>
        <input type="file" onChange={handleChange} />
        <button type="submit">Upload</button>
        <progress value={uploadProgress} max="100"></progress>
      </form>
    </div>
  );
}

export default FileUpload;


// https://maps.app.goo.gl/xHD7wp3xjVXLNuGF6
//<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.8895739978316!2d74.57424987418922!3d16.83183338396369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc11891caec8821%3A0xca895874a87fb681!2sUshahkal%20Abhinav%20Multisuperspeciality%20Hospital!5e0!3m2!1sen!2sin!4v1727965556813!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade