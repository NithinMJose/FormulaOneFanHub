using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class Comment
    {
        public int CommentId { get; set; }

        public string Content { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedOn { get; set; } = DateTime.Now;

        public DateTime? UpdatedOn { get; set; } // Nullable DateTime

        public int UserId { get; set; }
        public int TopicId { get; set; }
        public Topic Topic { get; set; }
    }
}
