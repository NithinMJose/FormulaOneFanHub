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
    public class TopicController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public TopicController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpPost("InsertTopic")]
        public IActionResult InsertTopic([FromBody] TopicDto topicDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var topicToCreate = new Topic
            {
                Title = topicDto.Title,
                Content = topicDto.Content,
                TeamId = topicDto.TeamId,
                CreatedOn = DateTime.Now
            };

            _fanHubContext.Topics.Add(topicToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }


        [HttpGet("GetAllTopics")]
        public IActionResult GetAllTopics()
        {
            var topics = _fanHubContext.Topics
                .Include(t => t.Team) // Include the related Team entity
                .Select(topic => new
                {
                    topic.TopicId,
                    topic.Title,
                    topic.Content,
                    topic.CreatedOn,
                    topic.TeamId,
                    TeamName = topic.Team.Name,
                    topic.Team.Country,
                    topic.Team.Status,
                    topic.Team.ImagePath
                })
                .ToList();

            return Ok(topics);
        }


        [HttpGet("GetTopicById")]
        public IActionResult GetTopicById(int id)
        {
            var topic = _fanHubContext.Topics.Find(id);

            if (topic == null)
            {
                return NotFound();
            }

            return Ok(topic);
        }

        [HttpPut("UpdateTopic")]
        public IActionResult UpdateTopic([FromBody] TopicDto topicDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTopic = _fanHubContext.Topics.Find(topicDto.TopicId);

            if (existingTopic == null)
            {
                return NotFound();
            }

            existingTopic.Title = topicDto.Title;
            existingTopic.Content = topicDto.Content;

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpDelete("DeleteTopic")]
        public IActionResult DeleteTopic(int id)
        {
            var topicToDelete = _fanHubContext.Topics.Find(id);

            if (topicToDelete == null)
            {
                return NotFound();
            }

            _fanHubContext.Topics.Remove(topicToDelete);
            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetTopicsByTeam")]
        public IActionResult GetTopicsByUser(int userId)
        {
            var topics = _fanHubContext.Topics
                .Where(topic => topic.TeamId == userId)
                .Include(t => t.Team) // Include the related Team entity
                .Select(topic => new TopicDto
                {
                    TopicId = topic.TopicId,
                    Title = topic.Title,
                    Content = topic.Content,
                    CreatedOn = topic.CreatedOn,
                    TeamId = topic.TeamId,
                    UserName = topic.Team.Name
                })
                .ToList();

            return Ok(topics);
        }
    }
}
