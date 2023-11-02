using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;

namespace FormulaOneFanHub.API.Entities
{
    public class UpdateDriverDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Dob { get; set; }
        public string Description { get; set; } = string.Empty;
        public IFormFile? ImageFile { get; set; }
        public string? ImagePath { get; set; }
    }
}
