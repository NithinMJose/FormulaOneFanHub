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
        public string? LastName { get; set; }
        public bool EmailConfirmed { get; set; } = false;
        public string? ConfirmEmailToken { get; set; }
            
        [ForeignKey("Role")]
        public int? RoleId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Role? Role { get; set; } // Navigation property for the related Role entity
    }
}
