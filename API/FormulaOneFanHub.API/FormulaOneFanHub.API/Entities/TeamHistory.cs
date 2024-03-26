using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class TeamHistory
    {
        [Key]
        public int HistoryId { get; set; }

        public String Heading { get; set; }

        public string Paragraph { get; set; }

        public int TeamId { get; set; }  // Add TeamId property

        [ForeignKey("TeamId")]  // Define foreign key relationship
        public Team Team { get; set; }  // Navigation property for Team
    }
}
