// Product.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class Product
    {
        public int ProductId { get; set; }

        [Required]
        [MaxLength(100)] // Adjust the length as needed
        public string ProductName { get; set; }

        [MaxLength(500)] // Adjust the length as needed
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int TeamId { get; set; } // Foreign key to Team table

        [Required]
        public int ProductCategoryId { get; set; } // Foreign key to Category table

        public Team Team { get; set; } // Navigation property to Team
        public ProductCategory ProductCategory { get; set; } // Navigation property to ProductCategory

        // Additional fields
        public int StockQuantity { get; set; } // Quantity available in stock

        public string ImagePath1 { get; set; } // Path to the first uploaded image on the server
        public string ImagePath2 { get; set; } // Path to the second uploaded image on the server
        public string? ImagePath3 { get; set; } // Path to the third uploaded image on the server (nullable)
        public string? ImagePath4 { get; set; } // Path to the fourth uploaded image on the server (nullable)

        public bool IsActive { get; set; } // Indicates whether the product is active for sale
        public string? UniqueName { get; set; }

    }
}
