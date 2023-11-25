using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class Vote
    {
        public int VoteId { get; set; }

        public int UserId { get; set; }

        public int PollId { get; set; }

        [Required(ErrorMessage = "OptionId is required")]
        public int OptionId { get; set; }
    }

}
