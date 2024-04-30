using System.ComponentModel.DataAnnotations;

public class CornerDto
{
    public int CornerId { get; set; }

    [Required(ErrorMessage = "CornerNumber is required")]
    public int CornerNumber { get; set; }

    [Required(ErrorMessage = "CornerCapacity is required")]
    public int CornerCapacity { get; set; }

    [Required(ErrorMessage = "SeasonYear is required")]
    public int SeasonYear { get; set; }

    [Required(ErrorMessage = "RaceName is required")]
    public string RaceName { get; set; }
}
