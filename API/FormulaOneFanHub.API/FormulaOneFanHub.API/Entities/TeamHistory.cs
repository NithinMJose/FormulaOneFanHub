using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class TeamHistory
    {
        [Key]
        public int HistoryId { get; set; }

        public int Heading { get; set; }

        public string Paragraph { get; set; }
    }
}
