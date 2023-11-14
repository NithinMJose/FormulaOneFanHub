import React, { useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';
import About from './About'; // Import the default export

export const AboutPage = () => {
  useEffect(() => {
    // Additional setup here
  }, []);

  return (
    <div className='aboutpagewrapper'>
      <AdminNavbar />
      <About />
      <Footer />
    </div>
  );
};

export default AboutPage;
