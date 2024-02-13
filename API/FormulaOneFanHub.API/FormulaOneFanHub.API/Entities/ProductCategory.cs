using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class ProductCategory
    {
        public int ProductCategoryId { get; set; }
        public string PCategoryName { get; set; } = string.Empty;
        [NotMapped]
        public IFormFile ImageFile { get; set; }
        public string? ImagePath { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public DateTime? UpdatedOn { get; set; }
    }
}
