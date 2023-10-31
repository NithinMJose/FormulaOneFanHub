// GalleryDto class
using Microsoft.AspNetCore.Http;

namespace FormulaOneFanHub.API.Entities
{
    public class GalleryDto
    {
        public IFormFile? ImageFile { get; set; }
        public string Caption { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty; // Add this line
    }
}
