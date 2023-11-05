// Footer.jsx

import React from 'react';
import './FooterAdmin.css'; // Import the CSS file for styling

function FooterAdmin() {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <>
      {/* Footer Start */}
      <footer className="new_footer_area bg_color">
        <div className="new_footer_top">
          <div className="container">
            <div className="row">
              <div
                className="col-lg-3 col-md-6"
              >
                <div
                  className="f_widget company_widget wow fadeInLeft"
                  data-wow-delay="0.2s"
                >
                  <h3 className="f-title f_600 t_color f_size_18">Get in Touch</h3>
                  <p>
                    Don’t miss any exciting Updates and News on Teams and Drivers.!
                  </p>
                  <form
                    action="#"
                    className="f_subscribe_two mailchimp"
                    method="post"
                    noValidate="true"
                    _lpchecked={1}
                  >
                    <input
                      type="text"
                      name="EMAIL"
                      className="form-control memail"
                      placeholder="Email"
                    />
                    <button className="btn btn_get btn_get_two" type="submit">
                      Subscribe
                    </button>
                    <p className="mchimp-errmessage" style={{ display: "none" }} />
                    <p className="mchimp-sucmessage" style={{ display: "none" }} />
                  </form>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6"
              >
                <div
                  className="f_widget about-widget pl_70 wow fadeInLeft"
                  data-wow-delay="0.4s"
                >
                  <h3 className="f-title f_600 t_color f_size_18">Services</h3>
                  <ul className="list-unstyled f_list">
                    <li>
                      <a href="#">Drivers</a>
                    </li>
                    <li>
                      <a href="#">Fan Poll</a>
                    </li>
                    <li>
                      <a href="#">Ticket Booking</a>
                    </li>
                    <li>
                      <a href="#">Open Forum</a>
                    </li>
                    <li>
                      <a href="#">F1 History</a>
                    </li>
                    <li>
                      <a href="#">Team History</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6"
              >
                <div
                  className="f_widget about-widget pl_70 wow fadeInLeft"
                  data-wow-delay="0.6s"
                >
                  <h3 className="f-title f_600 t_color f_size_18">Help</h3>
                  <ul className="list-unstyled f_list">
                    <li>
                      <a href="#">FAQ</a>
                    </li>
                    <li>
                      <a href="#">Term &amp; conditions</a>
                    </li>
                    <li>
                      <a href="#">Security and Privacy</a>
                    </li>
                    <li>
                      <a href="#">Documentation</a>
                    </li>
                    <li>
                      <a href="#">Support Policy</a>
                    </li>
                    <li>
                      <a href="#">Privacy</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6"
              >
                <div
                  className="f_widget social-widget pl_70 wow fadeInLeft"
                  data-wow-delay="0.8s"
                >
                  <h3 className="f-title f_600 t_color f_size_18">
                    Team Solutions
                  </h3>
                  <div className="f_social_icon">
                    <a href="https://www.facebook.com/Formula1/" className="fab fa-facebook" />
                    <a href="https://github.com/NithinMJose/FormulaOneFanHub" className="fab fa-github" />
                    <a href="https://www.linkedin.com/in/nithin-jose-20678077/" className="fab fa-linkedin" />
                    <a href="#" className="fab fa-google" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer_bg">
            <div className="footer_bg_one" />
            <div className="footer_bg_two" />
          </div>
        </div>
        <div className="footer_bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-7">
                <p className="mb-0 f_400">
                  © Nithin Jose {currentYear} All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Footer End */}
    </>
  );
}

export default FooterAdmin;
