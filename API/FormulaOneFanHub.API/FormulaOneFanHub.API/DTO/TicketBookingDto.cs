using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class TicketBookingDto
    {
        public int TicketBookingId { get; set; }

        public int UserId { get; set; }

        public int SeasonId { get; set; }

        public int RaceId { get; set; }

        public int CornerId { get; set; }

        public int TicketCategoryId { get; set; }

        public int NumberOfTicketsBooked { get; set; }

        public DateTime BookingDate { get; set; }

        public decimal TotalAmount { get; set; }

        public string PaymentStatus { get; set; }

        public DateTime? PaymentDate { get; set; }

        public string? ConfirmationNumber { get; set; }

        public string BookingStatus { get; set; }

        // Additional fields
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }

        public string PhoneContact { get; set; }

        // You can add more properties as needed
    }
}
