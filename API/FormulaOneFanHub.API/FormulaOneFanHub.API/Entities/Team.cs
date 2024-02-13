using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string Status { get; set; } = "active"; // Add Status property with default value
        public string TeamPrincipal { get; set; }
        public string TechnicalChief { get; set; }
        public string EngineSupplier { get; set; }
        public string Chassis { get; set; }
        public string? ImagePath { get; set; } = null;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public DateTime UpdatedOn { get; set; } = DateTime.Now;

        [ForeignKey("User")]
        public int? UserId { get; set; }

    }
}
