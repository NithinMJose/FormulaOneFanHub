﻿using FormulaOneFanHub.API.Data;
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
                ImagePath = seasonDto.ImagePath, // Set the ImagePath property
            };

            _fanHubContext.Seasons.Add(seasonToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetSeasons")]
        public IActionResult GetSeasons()
        {
            var seasons = _fanHubContext.Seasons;
            return Ok(seasons);
        }

        [HttpGet("GetSeasonById")]
        public IActionResult GetSeasonById(int id)
        {
            var season = _fanHubContext.Seasons.Find(id);
            return Ok(season);
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

        // Additional actions as needed

    }
}
