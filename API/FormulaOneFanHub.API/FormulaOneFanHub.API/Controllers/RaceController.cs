using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public RaceController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("CreateRace")]
        public IActionResult CreateRace([FromForm] RaceDto raceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (raceDto.ImageFile != null && raceDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + raceDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    raceDto.ImageFile.CopyTo(stream);
                }

                // Set the ImagePath here
                raceDto.ImagePath = fileName;
            }

            Race raceToCreate = new Race
            {
                RaceName = raceDto.RaceName,
                UniqueRaceName = $"{Guid.NewGuid()}_{raceDto.RaceName}",
                SeasonId = raceDto.SeasonId,
                RaceDate = raceDto.RaceDate,
                RaceLocation = raceDto.RaceLocation,
                ImagePath = raceDto.ImagePath, // Set the ImagePath property
            };

            _fanHubContext.Races.Add(raceToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetRaceById")]
        public IActionResult GetRaceById(int id)
        {
            var race = _fanHubContext.Races.Find(id);
            return Ok(race);
        }

        [HttpGet("GetRaceIdByUniqueRaceName")]
        public IActionResult GetRaceIdByUniqueRaceName(string uniqueRaceName)
        {
            var race = _fanHubContext.Races.FirstOrDefault(r => r.UniqueRaceName == uniqueRaceName);

            if (race == null)
            {
                return NotFound(); // Return 404 Not Found if race with provided unique name is not found
            }

            return Ok(race.RaceId);
        }




        [HttpPut("UpdateRace")]
        public IActionResult UpdateRace([FromForm] RaceDto raceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingRace = _fanHubContext.Races.Find(raceDto.RaceId);

            if (existingRace == null)
            {
                return NotFound();
            }

            existingRace.RaceName = raceDto.RaceName;
            existingRace.SeasonId = raceDto.SeasonId;
            existingRace.RaceDate = raceDto.RaceDate;
            existingRace.RaceLocation = raceDto.RaceLocation;

            if (raceDto.ImageFile != null && raceDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + raceDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    raceDto.ImageFile.CopyTo(stream);
                }

                existingRace.ImagePath = fileName;
            }

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpDelete("DeleteRace")]
        public IActionResult DeleteRace(int id)
        {
            var raceToDelete = _fanHubContext.Races.Find(id);

            if (raceToDelete == null)
            {
                return NotFound();
            }

            _fanHubContext.Races.Remove(raceToDelete);
            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetRaceBySeason")]
        public IActionResult GetRaceBySeason(int seasonId)
        {
            var races = _fanHubContext.Races
                .Where(race => race.SeasonId == seasonId)
                .ToList();

            return Ok(races);
        }

        [HttpGet("GetAllRaces")]
        public IActionResult GetAllRaces()
        {
            var races = _fanHubContext.Races.ToList();
            return Ok(races);
        }


    }
}
