using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeasonController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public SeasonController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("CreateSeason")]
        public IActionResult CreateSeason([FromForm] SeasonDto seasonDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if a season with the same year already exists
            var existingSeason = _fanHubContext.Seasons.FirstOrDefault(s => s.Year == seasonDto.Year);

            if (existingSeason != null)
            {
                return BadRequest("Year is already added in the database");
            }

            if (seasonDto.ImageFile != null && seasonDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + seasonDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    seasonDto.ImageFile.CopyTo(stream);
                }

                // Set the ImagePath here
                seasonDto.ImagePath = fileName;
            }

            Season seasonToCreate = new Season
            {
                Year = seasonDto.Year,
                Champion = seasonDto.Champion,
                ImagePath = seasonDto.ImagePath, 
                UniqueSeasonName = $"{Guid.NewGuid()}_{seasonDto.Year}"
            };

            _fanHubContext.Seasons.Add(seasonToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetSeasonById")]
        public IActionResult GetSeasonById(int id)
        {
            var season = _fanHubContext.Seasons.Find(id);
            return Ok(season);
        }

        [HttpDelete("GetSeasonByUniqueSeasonName")]
        public IActionResult GetSeasonByUniqueSeasonName(string uniqueSeasonName)
        {
            var season = _fanHubContext.Seasons.FirstOrDefault(s => s.UniqueSeasonName == uniqueSeasonName);

            if (season == null)
            {
                return NotFound();
            }

            return Ok(season);
        }


        [HttpGet("GetSeasonIdFromSeasonUniqueName")]
        public IActionResult GetSeasonIdFromSeasonUniqueName(string uniqueSeasonName)
        {
            var season = _fanHubContext.Seasons.FirstOrDefault(s => s.UniqueSeasonName == uniqueSeasonName);

            if (season == null)
            {
                return NotFound(); // Return 404 Not Found if season with provided unique name is not found
            }

            return Ok(season.SeasonId);
        }



        [HttpPut("UpdateSeason")]
        public IActionResult UpdateSeason([FromForm] SeasonDto seasonDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSeason = _fanHubContext.Seasons.Find(seasonDto.SeasonId);

            if (existingSeason == null)
            {
                return NotFound();
            }

            existingSeason.Year = seasonDto.Year;
            existingSeason.Champion = seasonDto.Champion;

            if (seasonDto.ImageFile != null && seasonDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + seasonDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    seasonDto.ImageFile.CopyTo(stream);
                }

                existingSeason.ImagePath = fileName;
            }

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetSeasons")]
        public IActionResult GetSeasons()
        {
            var seasons = _fanHubContext.Seasons.ToList();
            return Ok(seasons);
        }




        [HttpGet("SeasonsForBooking")]
        public IActionResult SeasonsForBooking()
        {
            // Get the current year
            int currentYear = DateTime.Now.Year;

            // Get the next four years
            var futureYears = Enumerable.Range(currentYear, 5);

            // Retrieve seasons for the current year and the next four years from the database
            var seasons = _fanHubContext.Seasons.Where(s => futureYears.Contains(s.Year)).ToList();

            // If there are no seasons for the current year and the next four years, return "No tickets are available"
            if (seasons.Count == 0)
            {
                return Ok("No tickets are available");
            }

            // If seasons are available, return the season IDs and seasons
            var result = new
            {
                Seasons = seasons
            };

            return Ok(result);
        }





        [HttpGet("SeasonIdFromYear")]
        public IActionResult SeasonIdFromYear(int year)
        {
            var season = _fanHubContext.Seasons.FirstOrDefault(s => s.Year == year);

            if (season != null)
            {
                return Ok(new { SeasonId = season.SeasonId });
            }

            return Ok("No year found in the database");
        }
    }
}
