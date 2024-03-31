import axios from "axios";
import logo from "../Components/Assets/a.jpg";

const TicketBookingDto = { amount: 50000 };

export default async function displayRazorPay(totalAmount, dataToTransfer, deliveryAddress, navigate) {
  try {
    console.log("==============================================================================================================================");
    console.log("Inside displayRazorPay");
    console.log("totalAmount", totalAmount);
    const receivedData = dataToTransfer;
    console.log("receivedData", receivedData);
    console.log('New Address:', deliveryAddress);

    totalAmount = totalAmount * 100;

    const data = await axios.post("https://localhost:7092/api/TicketBooking/BookTickets", {
      TotalAmount: totalAmount,
    });

    console.log("Data received from RazorPay : ", data);

    const options = {
      key: "rzp_test_wH5PplUikspRy6",
      amount: data.data.amount.toString(),
      currency: data.data.currency,
      description: "Formula One Fan Hub",
      image: { logo },
      order_id: data.data.id,
      handler: function (response) {
        alert("Payment ID : " + response.razorpay_payment_id);
        alert("Order ID : " + response.razorpay_order_id);
        const paymentId = response.razorpay_payment_id;
        const orderId = response.razorpay_order_id;
        const paymentDate = new Date();

        // Navigate to "/Home" page after successful payment
        console.log('Data to be sent to the FinalPage: ',receivedData);
        console.log('Payment ID : ', paymentId);
        console.log('Order ID : ', orderId);
        console.log('Payment Date : ', paymentDate);
        console.log('Total Amount : ', totalAmount);

        navigate('/BuyingFinalPage', { replace: true, state: { receivedData, paymentId, orderId, paymentDate, totalAmount, deliveryAddress } });
      },
      prefill: {
        name: "Formula One Fan Hub",
        email: "nithin@gmail.com",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error("Error in displayRazorPay:", error);
  }
}
