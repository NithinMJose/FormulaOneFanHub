using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FormulaOneFanHub.API.Entities
{
    public class DeliveryCompany
    {
        public int DeliveryCompanyId { get; set; }
        public string UniqueName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string CompanyStatus { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string ImagePath { get; set; } // Store the file path instead of IFormFile
        public DateTime? CreatedOn { get; set; }
        [JsonIgnore]
        public Order Order { get; set; } // Navigation property to Order
    }
}
