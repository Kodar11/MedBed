import React from "react";
import './Home.css';
import HospitalList from "./HospitalList";
import HospitalCard from "./HospitalCard";
import Map from "./Map";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Home() {
  return (
    <div className="">
      <Navbar />

      <HospitalList />
      <button className="load-more">Find More Hospitals</button>
      <Map />

      <Footer />

    </div>

  )
};

export default Home;
