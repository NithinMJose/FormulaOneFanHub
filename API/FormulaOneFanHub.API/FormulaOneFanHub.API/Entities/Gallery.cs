using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class Gallery
    {
        [Key]
        public int ImageId { get; set; }

        public string ImageUrl { get; set; }

        public string Caption { get; set; }
    }
}
