import axios from "axios";
import logo from "../Components/Assets/a.jpg";

const TicketBookingDto = { amount: 50000 };

export default async function displayRazorPay(totalAmount, contactNumber, dataToTransfer, navigate) {
  try {
    console.log("totalAmount", totalAmount, "contactNumber", contactNumber, "dataToTransfer", dataToTransfer, "navigate", navigate);
    const receivedData = dataToTransfer;
    console.log("receivedData", receivedData);

    // simple post to the node.js server
    console.log("inside displayRazorPay");
    console.log("Amount is ", { totalAmount });
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

        // Navigate to "/Home" page after successful payment
        console.log('Data to be sent to the FinalPage:', '1 : ',receivedData,'2 : ', paymentId, '3', orderId);
        navigate('/FinalPage', { replace: true, state: { receivedData, paymentId, orderId } });
      },
      prefill: {
        name: "Formula One Fan Hub",
        email: "nithin@gmail.com",
        contact: contactNumber,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error("Error in displayRazorPay:", error);
  }
}
