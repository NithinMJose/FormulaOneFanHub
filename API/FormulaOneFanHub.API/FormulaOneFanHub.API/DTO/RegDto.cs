﻿using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.DTO
{
    public class RegDto
    {
        [Required(ErrorMessage = "UserName is required")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            ErrorMessage = "Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character")]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "First name is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        public string LastName { get; set; }

        [Required(ErrorMessage ="Contact number is required")]
        public string ContactNumber { get; set; } = string.Empty;

        [Required(ErrorMessage ="Address is required")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage ="OTP is mandatory")]
        public string Otp { get; set; } = string.Empty;
    }
}
