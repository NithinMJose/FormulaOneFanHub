import React from 'react'
import displayRazorPay from "../utils/PaymentGateway";

function CourseCard() {
  return (
    <div>       
        <button type='button' onClick={displayRazorPay} className="course-payment-button" >
        Buy Now
        </button>
    </div>
  )
}

export default CourseCard