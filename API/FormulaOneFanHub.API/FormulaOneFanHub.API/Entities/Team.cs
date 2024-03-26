using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class Team
    {
        public int TeamId { get; set; }
        public string userName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public  string Password { get; set; } = string.Empty;
        public  string Email { get; set; } = string.Empty;
        public  string PhoneNumber { get; set; } = string.Empty;
        public  string Address1 { get; set; } = string.Empty;
        public  string Address2 { get; set; } = string.Empty;
        public  string Address3 { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Status { get; set; } = "active"; 
        public string TeamPrincipal { get; set; } = string.Empty;
        public string TechnicalChief { get; set; } = string.Empty;
        public string EngineSupplier { get; set; } = string.Empty;
        public string Chassis { get; set; } = string.Empty;
        [NotMapped]
        public IFormFile ImageFile { get; set; }
        public string? ImagePath { get; set; } = null;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public DateTime UpdatedOn { get; set; } = DateTime.Now;
        public ICollection<TeamHistory>? TeamHistories { get; set; }
        public List<Topic>? Topics { get; set; }


    }
}
