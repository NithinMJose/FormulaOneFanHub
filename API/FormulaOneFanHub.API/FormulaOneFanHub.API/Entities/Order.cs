using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class Order
    {
        public int OrderId { get; set; }

        [MaxLength(50)]
        public string UniqueId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [MaxLength(255)]
        [Required]
        public string Address { get; set; }

        [Required]
        public string OrderStatus { get; set; }

        public DateTime? ShippedDate { get; set; }

        [Required]
        public string PaymentNumberRazor { get; set; }

        [Required]
        public string PaymentStatus { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        public string? OrderIdRazor { get; set; }

        public decimal DiscountTotal { get; set; }
        public decimal OrderTotalAmount { get; set; }

        public ICollection<OrderedItem> OrderedItem { get; set; }

    }
}
