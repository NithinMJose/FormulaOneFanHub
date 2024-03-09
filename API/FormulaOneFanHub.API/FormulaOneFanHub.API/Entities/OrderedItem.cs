using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FormulaOneFanHub.API.Entities
{
    public class OrderedItem
    {
        [Key]
        public int OrderedItemId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal Price { get; set; }

        public decimal DiscountPrice { get; set; }

        public decimal FinalPrice { get; set; }

        public int OrderId { get; set; }
        [JsonIgnore]
        public Order Order { get; set; } // Navigation property to Order
    }
}
