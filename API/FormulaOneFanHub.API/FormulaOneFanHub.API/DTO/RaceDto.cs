using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class RaceDto
    {
        public int RaceId { get; set; }

        [Required(ErrorMessage = "RaceName is required")]
        public string RaceName { get; set; } = string.Empty;

        [Required(ErrorMessage = "SeasonYear is required")]
        public int SeasonYear { get; set; }

        [DataType(DataType.Date)] // Specify that only the date should be included
        [Required(ErrorMessage = "RaceDate is required")]
        public DateTime RaceDate { get; set; }

        [Required(ErrorMessage = "RaceLocation is required")]
        public string RaceLocation { get; set; }

        public IFormFile? ImageFile { get; set; }
        public string? ImagePath { get; set; }

    }
}
