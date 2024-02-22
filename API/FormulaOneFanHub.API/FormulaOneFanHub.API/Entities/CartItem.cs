using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class CartItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Let the database generate the CartItemId automatically
        public int CartItemId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public DateTime Timestamp { get; set; }

        [Required]
        public string Status { get; set; }

        // Additional fields
        public string Size { get; set; } // Size of the product (if applicable)

        // Navigation property to the Product
        public Product Product { get; set; }
    }
}
