using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class TicketBooking
    {
        [MaxLength(50)] // Adjust the length as needed
        public string UniqueId { get; set; }
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

        public DateTime? PaymentDate { get; set; } // Nullable DateTime

        public string? ConfirmationNumber { get; set; } // Nullable string

        public string BookingStatus { get; set; }

        // Additional fields
        [MaxLength(255)]
        public string FirstName { get; set; }

        [MaxLength(255)]
        public string LastName { get; set; }

        [MaxLength(255)]
        [Required]
        public string Address { get; set; }

        public string Email { get; set; }

        public string PhoneContact { get; set; }

        public Race Race { get; set; }
        public Corner Corner { get; set; } // Add this line

    }


}
