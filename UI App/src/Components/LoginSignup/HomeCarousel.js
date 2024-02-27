import React from 'react';

export const HomeCarousel = () => {
  return (
    <div style={{ position: 'relative', top: '3px' }}>
      <>
        {/* Carousel Start */}
        <div className="container-fluid p-0 mb-5 wow fadeIn" data-wow-delay="1s">
          <div
            id="header-carousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img className="w-100" src="img/pxfuel.jpg" alt="Image" style={{ marginTop: '0px', height: '800px' }}/>
                <div className="carousel-caption d-flex align-items-center justify-content-center text-start" style={{ marginTop: '0px' }}>
                  <div className="mx-sm-5 px-5" style={{ maxWidth: 900 }}>
                    <h1 className="display-2 text-white text-uppercase mb-4 animated slideInDown">
                      We Bring Entertainment at Your Fingertips
                    </h1>
                    <h4 className="text-white text-uppercase mb-4 animated slideInDown">
                      <i className="fa fa-map-marker-alt text-primary me-3" />
                      One Stop Destination for Formula1 Fans
                    </h4>
                    <h4 className="text-white text-uppercase mb-4 animated slideInDown">
                      <i className="fa fa-phone-alt text-primary me-3" />
                      +91 7510116760
                    </h4>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <img className="w-100" src="img/carousel2.jpeg" alt="Image" style={{ marginTop: '0px', height: '800px' }}/>
                <div className="carousel-caption d-flex align-items-center justify-content-center text-start" style={{ marginTop: '0px' }}>
                  <div className="mx-sm-5 px-5" style={{ maxWidth: 900 }}>
                    <h1 className="display-2 text-white text-uppercase mb-4 animated slideInDown">
                      View All the Latest News and Updates
                    </h1>
                    <h4 className="text-white text-uppercase mb-4 animated slideInDown">
                      <i className="fa fa-map-marker-alt text-primary me-3" />
                      We Will Keep You Updated
                    </h4>
                    <h4 className="text-white text-uppercase mb-4 animated slideInDown">
                      <i className="fa fa-phone-alt text-primary me-3" />
                      +91 7510116760
                    </h4>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <img className="w-100" src="img/carousel3.jpeg" alt="Image" style={{ marginTop: '0px', height: '800px' }}/>
                <div className="carousel-caption d-flex align-items-center justify-content-center text-start" style={{ marginTop: '0px' }}>
                  <div className="mx-sm-5 px-5" style={{ maxWidth: 900 }}>
                    <h1 className="display-2 text-white text-uppercase mb-4 animated slideInDown">
                      Book Your Tickets Now
                    </h1>
                    <h4 className="text-white text-uppercase mb-4 animated slideInDown">
                      <i className="fa fa-map-marker-alt text-primary me-3" />
                      Tickets at Affordable Prices
                    </h4>
                    <h4 className="text-white text-uppercase mb-4 animated slideInDown">
                      <i className="fa fa-phone-alt text-primary me-3" />
                      +91 7510116760
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#header-carousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#header-carousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        {/* Carousel End */}
      </>
    </div>
  );
};