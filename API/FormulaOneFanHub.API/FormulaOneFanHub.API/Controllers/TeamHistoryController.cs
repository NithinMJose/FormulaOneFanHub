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
        public IActionResult CreateTeamHistory([FromBody] TeamHistory teamHistory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
        public IActionResult UpdateTeamHistory(int id, [FromBody] TeamHistory teamHistory)
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

            existingTeamHistory.Heading = teamHistory.Heading;
            existingTeamHistory.Paragraph = teamHistory.Paragraph;

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
    }
}
