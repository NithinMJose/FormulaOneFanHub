using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class User
    {
        public int Id { get; set; }
        public required string UserName { get; set; } = string.Empty; 
        public required string Password { get; set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public required string FirstName { get; set; } = string.Empty;
        public  string? LastName { get; set; }
        public required string ContactNumber { get; set; } = string.Empty;
        public required string Address { get; set; } = string.Empty;
        public bool EmailConfirmed { get; set; } = false;

        [ForeignKey("Role")]
        public int? RoleId { get; set; }
        public string? CreatedBy { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? CreatedOn { get; set; }

        public Role? Role { get; set; } // Navigation property for the related Role entity
    }
}
