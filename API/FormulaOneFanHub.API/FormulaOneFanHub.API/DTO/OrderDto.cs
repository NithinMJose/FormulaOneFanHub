using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Dtos
{
    public class OrderDto
    {
        [Required(ErrorMessage = "User ID is required")]
        public required string UserId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [Phone(ErrorMessage = "Invalid phone number")]
        public required string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; }

        public DateTime? ShippingDate { get; set; }

        [Required(ErrorMessage = "Payment number is required")]
        public string PaymentNumberRazor { get; set; }

        [Required(ErrorMessage = "Payment status is required")]
        public string PaymentStatus = "Payed";

        [Required(ErrorMessage = "Payment date is required")]
        public DateTime PaymentDate { get; set; }

        public string OrderIdRazor { get; set; }

        public decimal OrderTotalAmount { get; set; }

        public required IEnumerable<OrderedItemDto> orderedItemsDto { get; set; }
    }
}
