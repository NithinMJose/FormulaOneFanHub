using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PollController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public PollController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("CreatePoll")]
        public IActionResult CreatePoll([FromBody] PollDto pollDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var poll = new Poll
            {
                Question = pollDto.Question,
                Option1 = pollDto.Option1,
                Option2 = pollDto.Option2,
                Option3 = pollDto.Option3,
                CreatedOn = DateTime.Now,
                PollingDate = pollDto.PollingDate
            };

            _fanHubContext.Polls.Add(poll);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetAllPolls")]
        public IActionResult GetAllPolls()
        {
            var polls = _fanHubContext.Polls.ToList();
            return Ok(polls);
        }

        [HttpGet("GetPollById")]
        public IActionResult GetPollById(int id)
        {
            var existingPoll = _fanHubContext.Polls.Find(id);

            if (existingPoll == null)
            {
                return NotFound();
            }

            return Ok(existingPoll);
        }

        [HttpPut("UpdatePoll")]
        public IActionResult UpdatePoll([FromBody] PollDto pollDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingPoll = _fanHubContext.Polls.Find(pollDto.PollId);

            if (existingPoll == null)
            {
                return NotFound();
            }

            existingPoll.Question = pollDto.Question;
            existingPoll.Option1 = pollDto.Option1;
            existingPoll.Option2 = pollDto.Option2;
            existingPoll.Option3 = pollDto.Option3;
            existingPoll.PollingDate = pollDto.PollingDate;

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpDelete("DeletePoll")]
        public IActionResult DeletePoll(int id)
        {
            var existingPoll = _fanHubContext.Polls.Find(id);

            if (existingPoll == null)
            {
                return NotFound();
            }

            _fanHubContext.Polls.Remove(existingPoll);
            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpPost("CreateVote")]
        public IActionResult CreateVote([FromBody] Vote vote)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _fanHubContext.Votes.Add(vote);
            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetVotesByPollId")]
        public IActionResult GetVotesByPollId(int pollId)
        {
            var votes = _fanHubContext.Votes.Where(v => v.PollId == pollId).ToList();
            return Ok(votes);
        }
    }
}
