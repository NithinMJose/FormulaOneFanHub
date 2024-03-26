using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamHistoryController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public TeamHistoryController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }




        [HttpPost("CreateTeamHistory")]
        public IActionResult CreateTeamHistory([FromBody] TeamHistoryDto teamHistoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var teamHistory = new TeamHistory
            {
                Heading = teamHistoryDto.Heading,
                Paragraph = teamHistoryDto.Paragraph,
                TeamId = teamHistoryDto.TeamId
            };

            _fanHubContext.TeamHistories.Add(teamHistory);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }


        [HttpGet("GetAllTeamHistories")]
        public IActionResult GetAllTeamHistories()
        {
            var teamHistories = _fanHubContext.TeamHistories.ToList();
            return Ok(teamHistories);
        }

        [HttpGet("GetTeamHistoryById")]
        public IActionResult GetTeamHistoryById(int id)
        {
            var teamHistory = _fanHubContext.TeamHistories.Find(id);

            if (teamHistory == null)
            {
                return NotFound();
            }

            return Ok(teamHistory);
        }
        [HttpPut("UpdateTeamHistory")]
        public IActionResult UpdateTeamHistory(int id, [FromBody] TeamHistoryDto teamHistoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTeamHistory = _fanHubContext.TeamHistories.Find(id);

            if (existingTeamHistory == null)
            {
                return NotFound();
            }

            existingTeamHistory.Heading = teamHistoryDto.Heading;
            existingTeamHistory.Paragraph = teamHistoryDto.Paragraph;
            existingTeamHistory.TeamId = teamHistoryDto.TeamId; // Update TeamId

            _fanHubContext.SaveChanges();

            return Ok();
        }


        [HttpDelete("DeleteTeamHistory")]
        public IActionResult DeleteTeamHistory(int id)
        {
            var teamHistory = _fanHubContext.TeamHistories.Find(id);

            if (teamHistory == null)
            {
                return NotFound();
            }

            _fanHubContext.TeamHistories.Remove(teamHistory);
            _fanHubContext.SaveChanges();

            return Ok();
        }


        [HttpGet("GetTeamHistoriesByTeamId")]
        public IActionResult GetTeamHistoriesByTeamId(int teamId)
        {
            var teamHistories = _fanHubContext.TeamHistories
                                            .Where(th => th.TeamId == teamId)
                                            .ToList();

            if (teamHistories == null || teamHistories.Count == 0)
            {
                return NotFound();
            }

            return Ok(teamHistories);
        }



        public class TeamHistoryDto
        {
            public int TeamId { get; set; }
            public string Heading { get; set; }
            public string Paragraph { get; set; }
        }

    }
}
