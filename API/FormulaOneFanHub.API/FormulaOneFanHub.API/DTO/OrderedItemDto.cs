using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Dtos
{
    public class OrderedItemDto
    {
        public int OrderedItemId { get; set; }

        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public decimal Total { get; set; }

        public decimal DiscountPercentage { get; set; }

        public decimal FinalPrice { get; set; }
    }
}
