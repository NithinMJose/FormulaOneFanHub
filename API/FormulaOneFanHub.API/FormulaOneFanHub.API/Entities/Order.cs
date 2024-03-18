using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class Order
    {
        [Key]
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

        public DateTime? ShippingDate { get; set; }

        [Required]
        public string PaymentNumberRazor { get; set; }

        [Required]
        public string PaymentStatus { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        public string? OrderIdRazor { get; set; }
        public decimal OrderTotalAmount { get; set; }
        public List<OrderedItem> OrderedItem { get; set; }
        // Foreign key for DeliveryCompany
        [ForeignKey("DeliveryCompany")]
        public int DeliveryCompanyId { get; set; }
        public DeliveryCompany DeliveryCompany { get; set; }

    }
}
