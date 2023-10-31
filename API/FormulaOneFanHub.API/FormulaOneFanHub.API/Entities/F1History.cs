using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class F1History
    {
        [Key]
        public int HistoryId { get; set; }

        public string Heading { get; set; }

        public string Paragraph { get; set; }
    }
}
