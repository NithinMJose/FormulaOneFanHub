using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class Topic
    {
        public int TopicId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; }

        [DataType(DataType.Date)] // Specify that only the date should be included
        public DateTime CreatedOn { get; set; } = DateTime.Now;

        // Foreign key to link the topic with the Team who created it (assuming your User entity has an Id property)
        public int TeamId { get; set; }
        public Team Team { get; set; } // Navigation property for the related Team entity
    }
}
