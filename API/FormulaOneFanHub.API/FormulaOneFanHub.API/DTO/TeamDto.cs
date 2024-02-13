using Microsoft.AspNetCore.Http;
using System;

namespace FormulaOneFanHub.API.Entities
{
    public class TeamDto
    {
        // Remove the Id property as it shouldn't be provided by the client
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Status { get; set; } // Add Status property
        public string TeamPrincipal { get; set; } = string.Empty;
        public string TechnicalChief { get; set; } = string.Empty;
        public string EngineSupplier { get; set; } = string.Empty;
        public string Chassis { get; set; } = string.Empty;
        public string? ImagePath { get; set; } = null;

        // Remove the default value assignment for UpdatedOn
        public IFormFile? ImageFile { get; set; }
    }
}
