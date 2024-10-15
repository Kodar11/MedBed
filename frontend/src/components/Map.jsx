import React from 'react';
// import './Home.css'

const Map = () => {
  return (
    <div className="w-full max-w-6xl mx-auto h-96 my-5">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.471500882776!2d74.56987917352765!3d16.85255474255267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc11868a4d1543b%3A0xf66f68ce8145c0ee!2sDistrict%20Civil%20Hospital%2C%20Sangli!5e0!3m2!1sen!2sin!4v1726681665013!5m2!1sen!2sin"
      className="w-full h-full border-0"
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
  
  );
};

export default Map