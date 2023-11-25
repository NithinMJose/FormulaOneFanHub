using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public CommentController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpPost("InsertComment")]
        public IActionResult InsertComment([FromBody] CommentDto commentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var commentToCreate = new Comment
            {
                Content = commentDto.Content,
                UserId = commentDto.UserId,
                TopicId = commentDto.TopicId,
                CreatedOn = DateTime.Now
            };

            _fanHubContext.Comments.Add(commentToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("TopicComments")]
        public IActionResult TopicComments([FromQuery] int topicId)
        {
            var topicComments = _fanHubContext.Comments
                .Where(c => c.TopicId == topicId)
                .ToList();

            if (topicComments == null || !topicComments.Any())
            {
                return NotFound("No comments found for the specified topic.");
            }

            var commentDtos = topicComments.Select(c => new CommentDto
            {
                CommentId = c.CommentId,
                Content = c.Content,
                CreatedOn = c.CreatedOn,
                UpdatedOn = c.UpdatedOn,
                UserId = c.UserId,
                TopicId = c.TopicId
            }).ToList();

            return Ok(commentDtos);
        }



        [HttpPut("EditComment/{commentId}")]
        public IActionResult EditComment(int commentId, [FromBody] CommentDto editedCommentDto)
        {
            try
            {
                var existingComment = _fanHubContext.Comments.FirstOrDefault(c => c.CommentId == commentId);

                if (existingComment == null)
                {
                    return NotFound("Comment not found.");
                }

                existingComment.Content = editedCommentDto.Content;
                existingComment.UpdatedOn = DateTime.Now;

                _fanHubContext.SaveChanges();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it) and return an error response
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        [HttpDelete("DeleteCommentById")]
        public IActionResult DeleteCommentById([FromBody] int commentId)
        {
            try
            {
                var commentToDelete = _fanHubContext.Comments.FirstOrDefault(c => c.CommentId == commentId);

                if (commentToDelete == null)
                {
                    return NotFound("Comment not found.");
                }

                _fanHubContext.Comments.Remove(commentToDelete);
                _fanHubContext.SaveChanges();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it) and return an error response
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }


        [HttpDelete("DeleteCommentByAdmin/{commentId}")]
        public IActionResult DeleteCommentByAdmin(int commentId)
        {
            try
            {
                var commentToDelete = _fanHubContext.Comments.FirstOrDefault(c => c.CommentId == commentId);

                if (commentToDelete == null)
                {
                    return NotFound("Comment not found.");
                }

                _fanHubContext.Comments.Remove(commentToDelete);
                _fanHubContext.SaveChanges();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it) and return an error response
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }
    }
}
