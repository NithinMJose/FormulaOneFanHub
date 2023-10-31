using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class Driver
    {
        public int DriverId { get; set; }
        public string Name { get; set; } = string.Empty;

        [DataType(DataType.Date)] // Specify that only the date should be included
        public DateTime Dob { get; set; }

        public string Description { get; set; } = string.Empty;

        [NotMapped]
        public IFormFile ImageFile { get; set; }

        public string? ImagePath { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public DateTime? UpdatedOn { get; set; }
    }
}
