using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class Poll
    {
        public int PollId { get; set; }

        [Required(ErrorMessage = "Question is required")]
        public string Question { get; set; }

        [Required(ErrorMessage = "Option1 is required")]
        public string Option1 { get; set; }

        [Required(ErrorMessage = "Option2 is required")]
        public string Option2 { get; set; }

        public string Option3 { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedOn { get; set; } = DateTime.Now;

        [DataType(DataType.Date)]
        public DateTime PollingDate { get; set; }
    }

}
