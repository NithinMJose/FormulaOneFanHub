using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeasonController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly BlobServiceClient _blobServiceClient;

        public SeasonController(FormulaOneFanHubContxt fanHubContxt, BlobServiceClient blobServiceClient)
        {
            _fanHubContext = fanHubContxt;
            _blobServiceClient = blobServiceClient;
        }

        [HttpPost("CreateSeason")]
        public async Task<IActionResult> CreateSeason([FromForm] SeasonDto seasonDto)
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

            var imageFile = seasonDto.ImageFile;

            if (imageFile != null && imageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = imageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                // Set the ImagePath here
                seasonDto.ImagePath = blobClient.Uri.AbsoluteUri;
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

        [HttpPut("UpdateSeason")]
        public async Task<IActionResult> UpdateSeason([FromForm] SeasonDto seasonDto)
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

            var imageFile = seasonDto.ImageFile;

            if (imageFile != null && imageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = imageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                existingSeason.ImagePath = blobClient.Uri.AbsoluteUri;
            }

            existingSeason.Year = seasonDto.Year;
            existingSeason.Champion = seasonDto.Champion;

            _fanHubContext.SaveChanges();

            return Ok();
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
