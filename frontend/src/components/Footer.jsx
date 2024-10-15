import React from "react";
// import '../components/User_components'; 

const Footer = () => {
    return (
      <footer>
        <div className="footer-content">
          <div className="footer-left">
            <h4>MEDBED</h4>
            <p>Leading the Way in Medical Excellence, Trusted Care</p>
          </div>
          <div className="footer-middle">
            <h4>Important Links</h4>
            <ul>
              <li>Home</li>
              <li>About Us</li>
            </ul>
          </div>
          <div className="footer-right">
            <h4>Contact Us</h4>
            <p>Call: +7064575293</p>
            <p>Email: medbed@medical.com</p>
            <p>Address: Mahavir College of Engineering, Sangli</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 All Rights Reserved by TRADEMC-LTD</p>
        </div>
      </footer>
    );
  };

  export default Footer