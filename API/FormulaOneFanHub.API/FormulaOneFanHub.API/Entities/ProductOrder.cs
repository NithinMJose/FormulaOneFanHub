using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class ProductOrder
    {
        public int ProductOrderId { get; set; }

        [Required]
        public int ProductId { get; set; } // Foreign key to Product table

        [Required]
        public int Quantity { get; set; } // Quantity of the product ordered

        [Required]
        public decimal UnitPrice { get; set; } // Price per unit at the time of order

        [Required]
        public DateTime OrderDate { get; set; } // Date and time when the order was placed

        // Additional fields
        public string UserId { get; set; } // User who placed the order

        public bool IsShipped { get; set; } // Indicates whether the order has been shipped
        public DateTime? ShippedDate { get; set; } // Date and time when the order was shipped (nullable)

        // Shipping address
        [MaxLength(255)]
        [Required]
        public string Address { get; set; } // Shipping address of the order

        // Additional fields for booking
        [MaxLength(50)] // Adjust the length as needed
        public string UniqueId { get; set; }

        public int TicketBookingId { get; set; }

        public string ReceiptNumber { get; set; }

        public int SeasonId { get; set; }

        public int RaceId { get; set; }

        public int CornerId { get; set; }

        public int TicketCategoryId { get; set; }

        public int NumberOfTicketsBooked { get; set; }

        public decimal TotalAmount { get; set; }

        public string PaymentStatus { get; set; }

        public DateTime? PaymentDate { get; set; } // Nullable DateTime

        public string? ConfirmationNumber { get; set; } // Nullable string

        public string BookingStatus { get; set; }
    }
}
