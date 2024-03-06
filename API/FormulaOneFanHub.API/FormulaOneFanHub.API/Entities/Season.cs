using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class Season
    {
        public int SeasonId { get; set; }
        public string? UniqueSeasonName { get; set; }
        public required int Year { get; set; }
        public string? Champion { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }
        public string? ImagePath { get; set; }
    }
}
