using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.DTO
{
    public class TeamUpdateDto
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Address1 is required")]
        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        [Required(ErrorMessage = "Country is required")]
        public string Country { get; set; }

        [Required(ErrorMessage = "Team principal is required")]
        public string TeamPrincipal { get; set; }

        [Required(ErrorMessage = "Technical chief is required")]
        public string TechnicalChief { get; set; }

        [Required(ErrorMessage = "Engine supplier is required")]
        public string EngineSupplier { get; set; }

        [Required(ErrorMessage = "Chassis is required")]
        public string Chassis { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? ImagePath { get; set; }




    }
}
