using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class SeasonDto
    {
        public int SeasonId { get; set; }

        [Required(ErrorMessage = "Year is required")]
        public int Year { get; set; }
        public string? Champion { get; set; } = string.Empty;
        public IFormFile? ImageFile { get; set; }
        public string? ImagePath { get; set; }

    }

}
