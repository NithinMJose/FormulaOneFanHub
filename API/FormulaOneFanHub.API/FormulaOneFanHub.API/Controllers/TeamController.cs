using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public TeamController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpPost("CreateTeam")]
        public IActionResult CreateTeam([FromForm] TeamDto teamDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (teamDto.ImageFile != null && teamDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + teamDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    teamDto.ImageFile.CopyTo(stream);
                }

                // Set the ImagePath here
                teamDto.ImagePath = fileName;
            }

            Team teamToCreate = new Team
            {
                Name = teamDto.Name,
                Country = teamDto.Country,
                TeamPrincipal = teamDto.TeamPrincipal,
                TechnicalChief = teamDto.TechnicalChief,
                EngineSupplier = teamDto.EngineSupplier,
                Chassis = teamDto.Chassis,
                ImagePath = teamDto.ImagePath
            };

            _fanHubContext.Teams.Add(teamToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }



        [HttpGet("GetTeams")]
        public IActionResult GetTeams()
        {
            var teams = _fanHubContext.Teams;
            return Ok(teams);
        }

        [HttpGet("GetTeamById")]
        public IActionResult GetTeamById(int id)
        {
            var team = _fanHubContext.Teams.Find(id);
            return Ok(team);
        }

        [HttpPut("UpdateTeam")]
        public IActionResult UpdateTeam([FromForm] TeamDto teamDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTeam = _fanHubContext.Teams.Find(teamDto.Id);

            if (existingTeam == null)
            {
                return NotFound();
            }

            existingTeam.Name = teamDto.Name;
            existingTeam.Country = teamDto.Country;
            existingTeam.TeamPrincipal = teamDto.TeamPrincipal;
            existingTeam.TechnicalChief = teamDto.TechnicalChief;
            existingTeam.EngineSupplier = teamDto.EngineSupplier;
            existingTeam.Chassis = teamDto.Chassis;
            existingTeam.Status = teamDto.Status; // Update Status property

            if (teamDto.ImageFile != null && teamDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + teamDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    teamDto.ImageFile.CopyTo(stream);
                }

                existingTeam.ImagePath = fileName;
            }

            existingTeam.UpdatedOn = DateTime.Now;

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetTeamNameOnly")]
        public IActionResult GetTeamNameOnly()
        {
            var teamNames = _fanHubContext.Teams.Select(team => team.Name);
            return Ok(teamNames);
        }



    }
}
