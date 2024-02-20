using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Dtos
{
    public class ProductDto
    {
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Product name is required")]
        public string ProductName { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Team ID is required")]
        public int TeamId { get; set; }

        [Required(ErrorMessage = "Category ID is required")]
        public int ProductCategoryId { get; set; }

        public int StockQuantity { get; set; }

        public IFormFile? ImageFile1 { get; set; }
        public IFormFile? ImageFile2 { get; set; }
        public IFormFile? ImageFile3 { get; set; }
        public IFormFile? ImageFile4 { get; set; }

        public bool IsActive { get; set; }
    }
}
