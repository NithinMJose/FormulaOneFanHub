using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
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

        public TicketBookingController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
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

            decimal totalAmount = ticketCategory.TicketPrice * ticketBookingDto.NumberOfTicketsBooked;

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
                BookingDate = DateTime.Now,
                TotalAmount = totalAmount,
                Email = ticketBookingDto.Email,
                FirstName = ticketBookingDto.FirstName,
                LastName = ticketBookingDto.LastName,
                PhoneContact = ticketBookingDto.PhoneContact,
                PaymentStatus = "Pending", // You may update this based on your payment flow
                BookingStatus = "Confirmed", // You may update this based on your booking flow
                // Set other properties as needed
            };

            _fanHubContext.TicketBookings.Add(ticketBooking);

            // Update available capacity of the corner
            corner.AvailableCapacity -= ticketBookingDto.NumberOfTicketsBooked;

            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        // Other actions such as GetTicketBookings, GetTicketBookingById, CancelBooking, etc., can be added based on your requirements
    }
}
