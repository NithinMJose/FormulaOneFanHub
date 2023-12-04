import React, { useEffect } from 'react'
import CourseCard from '../CourseCard';


function TBConfirm3() {


    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");

            script.src = src;

            script.onload = () => {
                resolve(true);
            }

            script.onerror = () => {
                resolve(false);
            }

            document.body.appendChild(script);
        })

    }
    useEffect(() => {
        loadScript("https://checkout.razorpay.com/v1/checkout.js");
})








  return (
    <selection className='card-list'>
        <CourseCard/>
    
    </selection>
  );
}

export default TBConfirm3