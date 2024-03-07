using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Dtos
{
    public class OrderDto
    {
        public int OrderId { get; set; }

        public string UniqueId { get; set; }

        [Required(ErrorMessage = "Order date is required")]
        public DateTime OrderDate { get; set; }

        [Required(ErrorMessage = "User ID is required")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Order status is required")]
        public string OrderStatus { get; set; }

        public DateTime? ShippedDate { get; set; }

        [Required(ErrorMessage = "Payment number is required")]
        public string PaymentNumberRazor { get; set; }

        [Required(ErrorMessage = "Payment status is required")]
        public string PaymentStatus { get; set; }

        [Required(ErrorMessage = "Payment date is required")]
        public DateTime PaymentDate { get; set; }

        public string OrderIdRazor { get; set; }

        public decimal DiscountTotal { get; set; }
        public decimal OrderTotalAmount { get; set; }
    }
}
