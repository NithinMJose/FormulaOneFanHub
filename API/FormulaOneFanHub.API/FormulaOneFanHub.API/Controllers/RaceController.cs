using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly BlobServiceClient _blobServiceClient;

        public RaceController(FormulaOneFanHubContxt fanHubContxt, BlobServiceClient blobServiceClient)
        {
            _fanHubContext = fanHubContxt;
            _blobServiceClient = blobServiceClient;
        }

        [HttpPost("CreateRace")]
        public async Task<IActionResult> CreateRace([FromForm] RaceDto raceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Fetch SeasonId based on the provided SeasonYear
            var season = await _fanHubContext.Seasons.FirstOrDefaultAsync(s => s.Year == raceDto.SeasonYear);
            if (season == null)
            {
                return BadRequest("Season not found for the provided year.");
            }

            // Check if the year of raceDate matches the provided seasonYear
            if (raceDto.RaceDate.Year != raceDto.SeasonYear)
            {
                return BadRequest("Year value does not match.");
            }

            if (raceDto.ImageFile != null && raceDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + raceDto.ImageFile.FileName;
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = raceDto.ImageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                // Set the ImagePath here
                raceDto.ImagePath = blobClient.Uri.AbsoluteUri;
            }

            Race raceToCreate = new Race
            {
                RaceName = raceDto.RaceName,
                UniqueRaceName = $"{Guid.NewGuid()}_{raceDto.RaceName}",
                //SeasonId id fetched from seson entity using the season year data
                SeasonId = season.SeasonId,
                RaceDate = raceDto.RaceDate,
                RaceLocation = raceDto.RaceLocation,
                ImagePath = raceDto.ImagePath, // Set the ImagePath property
            };

            _fanHubContext.Races.Add(raceToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpPut("UpdateRace")]
        public async Task<IActionResult> UpdateRace([FromForm] RaceDto raceDto)
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

            var season = await _fanHubContext.Seasons.FirstOrDefaultAsync(s => s.Year == raceDto.SeasonYear);
            if (season == null)
            {
                return BadRequest("Season not found for the provided year.");
            }

            // Check if the year of raceDate matches the provided seasonYear
            if (raceDto.RaceDate.Year != raceDto.SeasonYear)
            {
                return BadRequest("Year value does not match.");
            }

            existingRace.RaceName = raceDto.RaceName;
            existingRace.SeasonId = season.SeasonId;
            existingRace.RaceDate = raceDto.RaceDate;
            existingRace.RaceLocation = raceDto.RaceLocation;

            if (raceDto.ImageFile != null && raceDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + raceDto.ImageFile.FileName;
                var blobContainerName = "web";
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = raceDto.ImageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                existingRace.ImagePath = blobClient.Uri.AbsoluteUri;
            }

            _fanHubContext.SaveChanges();

            return Ok();
        }




        [HttpGet("GetRaceById")]
        public IActionResult GetRaceById(int id)
        {
            var race = _fanHubContext.Races
                .Include(r => r.Season) // Include the Season entity
                .FirstOrDefault(r => r.RaceId == id);

            if (race == null)
            {
                return NotFound();
            }

            var response = new
            {
                race.RaceId,
                race.RaceName,
                race.UniqueRaceName,
                race.SeasonId,
                race.RaceDate,
                race.RaceLocation,
                race.ImagePath,
                SeasonYear = race.Season.Year // Include the SeasonYear
            };

            return Ok(response);
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
            var races = _fanHubContext.Races
                .Include(r => r.Season) // Include the Season entity
                .ToList();

            var response = races.Select(r => new
            {
                r.RaceId,
                r.RaceName,
                r.UniqueRaceName,
                r.SeasonId,
                r.RaceDate,
                r.RaceLocation,
                r.ImagePath,
                SeasonYear = r.Season.Year // Include the SeasonYear
            });

            return Ok(response);
        }

        [HttpGet("GetRacesBySeasonYear")]
        public IActionResult GetRacesBySeasonYear(int year)
        {
            var races = _fanHubContext.Races
                .Include(r => r.Season) // Include the Season entity
                .Where(r => r.Season.Year == year)
                .ToList();

            if (races == null || !races.Any())
            {
                //return Ok
                return Ok("Hello There");
            }

            var response = races.Select(r => new
            {
                r.RaceId,
                r.RaceName,
                r.UniqueRaceName,
                r.SeasonId,
                r.RaceDate,
                r.RaceLocation,
                r.ImagePath,
                SeasonYear = r.Season.Year // Include the SeasonYear
            });

            return Ok(response);
        }



    }
}
