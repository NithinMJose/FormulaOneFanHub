using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class SoldItem
    {
        [Key]
        public int SoldItemId { get; set; }

        [Required]
        public int OrderId { get; set; } // Foreign key to Order table

        [Required]
        public int ProductId { get; set; } // Foreign key to Product table

        [Required]
        public int TeamId { get; set; } // Foreign key to Team table

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal PricePerItem { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime SoldDate { get; set; } = DateTime.Now;

        public string Status { get; set; } = "sold";


        // Navigation properties
        public Order Order { get; set; }
        public Product Product { get; set; }
        public Team Team { get; set; }
    }
}
