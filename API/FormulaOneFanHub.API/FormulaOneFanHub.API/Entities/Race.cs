using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class Race
    {
        public int RaceId { get; set; }
        public string RaceName { get; set; } = string.Empty;

        [Required(ErrorMessage = "SeasonId is required")]
        public int SeasonId { get; set; }

        public Season Season { get; set; } // Navigation property for the related Season entity

        [DataType(DataType.Date)] // Specify that only the date should be included
        public DateTime RaceDate { get; set; }

        public required string RaceLocation { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }

        public string? ImagePath { get; set; }
    
    }
}
