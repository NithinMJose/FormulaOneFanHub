using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Dtos
{
    public class ProductCategoryDto
    {
        [Required(ErrorMessage = "Category name is required")]
        public string PCategoryName { get; set; }
        public IFormFile ImageFile { get; set; }
        public string? ImagePath { get; set; } // Add ImagePath property
    }
}
