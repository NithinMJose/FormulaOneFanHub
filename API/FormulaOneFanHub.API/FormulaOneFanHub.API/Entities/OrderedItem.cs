using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class OrderedItem
    {
        public int OrderedItemId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal Price { get; set; }

        public decimal DiscountPercentage { get; set; }

        public decimal FinalPrice { get; set; }

        public Order Order { get; set; }
        public int OrderId { get; set; }
    }
}
