using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class CommentDto
    {
        public int CommentId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int TopicId { get; set; }

    }

}
