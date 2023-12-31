﻿using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
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

        public TicketBookingController(FormulaOneFanHubContxt fanHubContext, RazorPayService razorPayService)
        {
            _fanHubContext = fanHubContext;
            _razorPayService = razorPayService;
        }

        [HttpPost("BookTickets")]
        public IActionResult BookTickets([FromBody] TicketBookingDto ticketBookingDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the requested number of tickets is available
            //var corner = _fanHubContext.Corners.Find(ticketBookingDto.CornerId);
            //if (corner == null || corner.AvailableCapacity < ticketBookingDto.NumberOfTicketsBooked)
            //{
            //    return BadRequest("Requested number of tickets not available for the selected corner.");
            //}

            // Calculate total amount based on ticket price and number of tickets booked
            //var ticketCategory = _fanHubContext.TicketCategories.Find(ticketBookingDto.TicketCategoryId);
            //if (ticketCategory == null)
            //{
            //    return BadRequest("Invalid Ticket Category.");
            //}

            //decimal totalAmount = ticketCategory.TicketPrice * ticketBookingDto.NumberOfTicketsBooked;

            // Create a RazorPay order
            var razorPayOrderResponse = _razorPayService.CreateOrder(ticketBookingDto.TotalAmount,"receipt1", "test note 1");
            if(!razorPayOrderResponse.IsSuccess)
            {
                return BadRequest(razorPayOrderResponse.ErrorResponse);
            }

            var orderId = razorPayOrderResponse.SuccessResponse.id;
            var currency = razorPayOrderResponse.SuccessResponse.currency;
            var amount = razorPayOrderResponse.SuccessResponse.amount;  


            // Create a new TicketBooking entity
            //var ticketBooking = new TicketBooking
            //{
            //    UserId = ticketBookingDto.UserId,
            //    SeasonId = ticketBookingDto.SeasonId,
            //    RaceId = ticketBookingDto.RaceId,
            //    CornerId = ticketBookingDto.CornerId,
            //    //TicketCategoryId = ticketBookingDto.TicketCategoryId,
            //    NumberOfTicketsBooked = ticketBookingDto.NumberOfTicketsBooked,
            //    Address = ticketBookingDto.Address,
            //    BookingDate = DateTime.Now,
            //    TotalAmount = totalAmount,
            //    Email = ticketBookingDto.Email,
            //    FirstName = ticketBookingDto.FirstName,
            //    LastName = ticketBookingDto.LastName,
            //    PhoneContact = ticketBookingDto.PhoneContact,
            //    PaymentStatus = "Pending",
            //    BookingStatus = "Confirmed",
            //    ReceiptNumber = GenerateReceiptNumber(),
            //    UniqueId = GenerateUniqueId(), // Generate a unique ID using GUID
            //                                   // Set other properties as needed
            //};

            //_fanHubContext.TicketBookings.Add(ticketBooking);

            //// Update available capacity of the corner
            //corner.AvailableCapacity -= ticketBookingDto.NumberOfTicketsBooked;

            //_fanHubContext.SaveChanges();

            return StatusCode(201, new BookTicketsResponseDto { id = orderId,currency=currency,amount = amount });
        }

        // Add a method to generate a unique ID
        private string GenerateUniqueId()
        {
            // Generate a unique ID using GUID
            return Guid.NewGuid().ToString();
        }

        private string GenerateReceiptNumber()
        {
            // Get the last receipt number from the database
            var lastReceiptNumber = _fanHubContext.TicketBookings
                .OrderByDescending(tb => tb.ReceiptNumber)
                .Select(tb => tb.ReceiptNumber)
                .FirstOrDefault();

            int lastReceiptNumberNumericPart = 000;
            // Extract the numeric part of the last receipt number
            var isNotFirstReciept = int.TryParse(lastReceiptNumber?.Substring(3),out lastReceiptNumberNumericPart);

            if(!isNotFirstReciept)
            {
                return "FFH000001";
            }

            var newReceiptNumberNumericPart = lastReceiptNumberNumericPart + 1;

            // Format the new receipt number with leading zeros
            var newReceiptNumber = $"FFH{newReceiptNumberNumericPart.ToString("D6")}";

            return newReceiptNumber;
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




        [HttpPost("TBDBSave")]
        public IActionResult TBDBSave([FromBody] TicketBookingDBSaveDto ticketBookingDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var ticketBooking = new TicketBooking
            {
                UniqueId = ticketBookingDto.UniqueId,
                UserId = ticketBookingDto.UserId,
                ReceiptNumber = ticketBookingDto.ReceiptNumber,
                SeasonId = ticketBookingDto.SeasonId,
                RaceId = ticketBookingDto.RaceId,
                CornerId = ticketBookingDto.CornerId,
                TicketCategoryId = ticketBookingDto.TicketCategoryId,
                NumberOfTicketsBooked = ticketBookingDto.NumberOfTicketsBooked,
                Address = ticketBookingDto.Address,
                BookingDate = DateTime.Now,
                TotalAmount = ticketBookingDto.TotalAmount,
                Email = ticketBookingDto.Email,
                FirstName = ticketBookingDto.FirstName,
                LastName = ticketBookingDto.LastName,
                PhoneContact = ticketBookingDto.PhoneContact,
                PaymentStatus = "Paid" ,
                PaymentDate = DateTime.Now,
                ConfirmationNumber = ticketBookingDto.ConfirmationNumber,
                BookingStatus = "Confirmed",
            };

            _fanHubContext.TicketBookings.Add(ticketBooking);
            _fanHubContext.SaveChanges();

            return StatusCode(201, new { Message = "Ticket booking saved successfully." });
        }


        // Other actions such as GetTicketBookings, GetTicketBookingById, CancelBooking, etc., can be added based on your requirements
    }
}
