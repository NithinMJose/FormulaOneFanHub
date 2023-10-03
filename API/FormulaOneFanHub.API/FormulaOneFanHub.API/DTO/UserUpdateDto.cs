using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.DTO
{
    public class UserUpdateDto
    {
        [Required(ErrorMessage = "UserName is required")]
        public string UserName { get; set; }


        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }


        [Required(ErrorMessage = "First name is required")]
        public string FirstName { get; set; }


        [Required(ErrorMessage = "Last name is required")]
        public string? LastName { get; set; }

    }
}
