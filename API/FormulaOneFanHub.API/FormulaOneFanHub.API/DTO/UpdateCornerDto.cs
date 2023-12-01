using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class UpdateCornerDto
    {
        [Required(ErrorMessage = "CornerId is required")]
        public int CornerId { get; set; }

        [Required(ErrorMessage = "CornerNumber is required")]
        public int CornerNumber { get; set; }

        [Required(ErrorMessage = "CornerCapacity is required")]
        public int CornerCapacity { get; set; }
    }
}
