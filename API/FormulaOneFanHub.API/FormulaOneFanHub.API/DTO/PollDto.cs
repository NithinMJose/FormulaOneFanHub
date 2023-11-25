using System;

namespace FormulaOneFanHub.API.Entities
{
    public class PollDto
    {
        public int PollId { get; set; }
        public string Question { get; set; }
        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime PollingDate { get; set; }
    }
}
