using Microsoft.AspNetCore.Http;
using System;

namespace FormulaOneFanHub.API.Entities
{
    public class DriverDto
    {
        public int Id { get; set; } 
        public string Name { get; set; } = string.Empty;
        public int TeamIdRef { get; set; }
        public DateTime Dob { get; set; }
        public string Description { get; set; } = string.Empty;
        public IFormFile? ImageFile { get; set; }
        public string? ImagePath { get; set; }
        public string? Status { get; set; }
    }

}
