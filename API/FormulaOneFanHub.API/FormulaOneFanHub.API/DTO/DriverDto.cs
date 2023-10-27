using Microsoft.AspNetCore.Http;
using System;

namespace FormulaOneFanHub.API.Entities
{
    public class DriverDto
    {
        public string Name { get; set; } = string.Empty;
        public DateTime Dob { get; set; }
        public string Description { get; set; } = string.Empty;
        public IFormFile ImageFile { get; set; }
        public string? ImagePath { get; set; } // Add this line
    }
}
