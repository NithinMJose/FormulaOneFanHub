using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class TopicDto
    {
        public int TopicId { get; set; }
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
    }


}
