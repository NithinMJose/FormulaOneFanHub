using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using FormulaOneFanHub.API.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketBookingController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly RazorPayService _razorPayService;
        private readonly RazorPayServiceNithin _razorPayServiceNithin;


        public TicketBookingController(FormulaOneFanHubContxt fanHubContext, RazorPayService razorPayService)
        {
            _fanHubContext = fanHubContext;
            _razorPayService = razorPayService;
            _razorPayServiceNithin = razorPayServiceNithin;
        }

        [HttpPost("BookTickets")]
        public IActionResult BookTickets([FromBody] TicketBookingDto ticketBookingDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the requested number of tickets is available
            var corner = _fanHubContext.Corners.Find(ticketBookingDto.CornerId);
            if (corner == null || corner.AvailableCapacity < ticketBookingDto.NumberOfTicketsBooked)
            {
                return BadRequest("Requested number of tickets not available for the selected corner.");
            }

            // Calculate total amount based on ticket price and number of tickets booked
            var ticketCategory = _fanHubContext.TicketCategories.Find(ticketBookingDto.TicketCategoryId);
            if (ticketCategory == null)
            {
                return BadRequest("Invalid Ticket Category.");
            }
            var lastReceipt = _fanHubContext.TicketBookings.OrderByDescending(x => x.ReceiptNumber).FirstOrDefault()?.ReceiptNumber;

            decimal totalAmount = ticketCategory.TicketPrice * ticketBookingDto.NumberOfTicketsBooked;
            var receiptNumber = GenerateReceiptNumber(lastReceipt);

            var notes = ("some test notes");

            //call razorpay api
            var paymentResponse = _razorPayService.CreateOrder(totalAmount, receiptNumber, notes);

            if(paymentResponse is null ||!paymentResponse.IsSuccess)
            {
                //razor pay payment failed
                return BadRequest("Payment failed");
            }

            // Create a new TicketBooking entity
            var ticketBooking = new TicketBooking
            {
                UserId = ticketBookingDto.UserId,
                SeasonId = ticketBookingDto.SeasonId,
                RaceId = ticketBookingDto.RaceId,
                CornerId = ticketBookingDto.CornerId,
                TicketCategoryId = ticketBookingDto.TicketCategoryId,
                NumberOfTicketsBooked = ticketBookingDto.NumberOfTicketsBooked,
                Address = ticketBookingDto.Address,
                ReceiptNumber = receiptNumber,
                BookingDate = DateTime.Now,
                TotalAmount = totalAmount,
                Email = ticketBookingDto.Email,
                FirstName = ticketBookingDto.FirstName,
                LastName = ticketBookingDto.LastName,
                PhoneContact = ticketBookingDto.PhoneContact,
                PaymentStatus = "Pending",
                BookingStatus = "Confirmed",
                UniqueId = GenerateUniqueId(), // Generate a unique ID using GUID
                                               // Set other properties as needed
            };

            _fanHubContext.TicketBookings.Add(ticketBooking);

            // Update available capacity of the corner
            corner.AvailableCapacity -= ticketBookingDto.NumberOfTicketsBooked;

            _fanHubContext.SaveChanges();

            return StatusCode(201, new { TicketBookingId = ticketBooking.TicketBookingId });
        }

        // Add a method to generate a unique ID
        private string GenerateUniqueId()
        {
            // Generate a unique ID using GUID
            return Guid.NewGuid().ToString();
        }

        public string GenerateReceiptNumber(string lastReceipt)
        {
            string receiptNumber = lastReceipt.Substring(4); // Extract the number from the receipt
            int number = int.Parse(receiptNumber);
            number++; // Increment the number by 1
            string newReceiptNumber = number.ToString().PadLeft(6, '0'); // Pad the number with leading zeros
            return $"FFH {newReceiptNumber}"; // Return the new receipt number
        }



        [HttpGet("GetTicketDetailsById/{ticketBookingId}")]
        public IActionResult GetTicketDetailsById(int ticketBookingId)
        {
            // Find the ticket booking by ID
            var ticketBooking = _fanHubContext.TicketBookings.Find(ticketBookingId);

            // Check if the ticket booking is found
            if (ticketBooking == null)
            {
                return NotFound($"Ticket booking with ID {ticketBookingId} not found.");
            }

            // You may want to include additional logic or mapping based on your requirements

            return Ok(ticketBooking);
        }

        [HttpGet("GetTicketBookingHistoryByUserId/{userId}")]
        public IActionResult GetTicketBookingHistoryByUserId(int userId)
        {
            // Find all ticket bookings for the specified user ID
            var ticketBookings = _fanHubContext.TicketBookings
                .Where(tb => tb.UserId == userId)
                .ToList();

            // Check if any ticket bookings are found
            if (ticketBookings == null || ticketBookings.Count == 0)
            {
                return NotFound($"No ticket bookings found for user with ID {userId}.");
            }

            // You may want to include additional logic or mapping based on your requirements

            return Ok(ticketBookings);
        }



        // Other actions such as GetTicketBookings, GetTicketBookingById, CancelBooking, etc., can be added based on your requirements
    }
}
