import React, { useEffect } from 'react';
import Footer from './Footer';
import About from './About'; // Import the default export
import HomeNavbar from './HomeNavbar';

export const AboutPage = () => {
  useEffect(() => {
    // Additional setup here
  }, []);

  return (
    <div className='aboutpagewrapper'>
      <HomeNavbar />
      <About />
      <Footer />
    </div>
  );
};

export default AboutPage;
