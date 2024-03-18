using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace FormulaOneFanHub.API.DTO
{
    public class DeliveryCompanyDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Company name is required")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "Contact number is required")]
        public string ContactNumber { get; set; }

        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; }

        public IFormFile ImageFile { get; set; } // Added property for image file
    }
}
