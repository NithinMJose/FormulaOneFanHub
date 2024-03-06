using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CornerController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public CornerController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpPost("InsertCorner")]
        public IActionResult InsertCorner([FromBody] CornerDto cornerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cornerToCreate = new Corner
            {
                CornerNumber = cornerDto.CornerNumber,
                CornerCapacity = cornerDto.CornerCapacity,
                RaceId = cornerDto.RaceId,
                AvailableCapacity = cornerDto.CornerCapacity
            };

            _fanHubContext.Corners.Add(cornerToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetAllCorners")]
        public IActionResult GetAllCorners()
        {
            var corners = _fanHubContext.Corners.Include(c => c.Race);
            return Ok(corners);
        }

        [HttpGet("GetCornerById")]
        public IActionResult GetCornerById(int id)
        {
            var corner = _fanHubContext.Corners.Find(id);

            if (corner == null)
            {
                return NotFound();
            }

            return Ok(corner);
        }

        [HttpPut("UpdateCorner")]
        public IActionResult UpdateCorner([FromBody] UpdateCornerDto updateCornerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCorner = _fanHubContext.Corners.Find(updateCornerDto.CornerId);

            if (existingCorner == null)
            {
                return NotFound();
            }

            // Check if CornerCapacity is increased
            if (updateCornerDto.CornerCapacity > existingCorner.CornerCapacity)
            {
                // Increase AvailableCapacity by the difference
                existingCorner.AvailableCapacity += updateCornerDto.CornerCapacity - existingCorner.CornerCapacity;
            }
            // Check if CornerCapacity is decreased and available seats are less than the proposed decrease
            else if (updateCornerDto.CornerCapacity < existingCorner.CornerCapacity && existingCorner.AvailableCapacity < (existingCorner.CornerCapacity - updateCornerDto.CornerCapacity))
            {
                return BadRequest($"The number of available seats is insufficient. Cannot decrease capacity by {existingCorner.CornerCapacity - updateCornerDto.CornerCapacity} seats.");
            }

            existingCorner.CornerNumber = updateCornerDto.CornerNumber;
            existingCorner.CornerCapacity = updateCornerDto.CornerCapacity;

            _fanHubContext.SaveChanges();

            return Ok();
        }



        [HttpDelete("DeleteCorner")]
        public IActionResult DeleteCorner(int id)
        {
            var cornerToDelete = _fanHubContext.Corners.Find(id);

            if (cornerToDelete == null)
            {
                return NotFound();
            }

            _fanHubContext.Corners.Remove(cornerToDelete);
            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetCornerByRace")]
        public IActionResult GetCornerByRace(int raceId)
        {
            var corners = _fanHubContext.Corners
                .Where(corner => corner.RaceId == raceId)
                .Include(c => c.Race) // Include the related Race entity
                .Select(corner => new
                {
                    corner.CornerId,
                    corner.CornerNumber,
                    corner.CornerCapacity,
                    corner.AvailableCapacity, // Include AvailableCapacity in the response
                    corner.RaceId,
                    corner.Race // Include the related Race entity
                })
                .ToList();

            return Ok(corners);
        }




        [HttpPut("UpdateCornerSeatByTicketCancel")]
        public IActionResult UpdateCornerSeatByTicketCancel([FromBody] UpdateCornerSeatDto updateCornerSeatDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCorner = _fanHubContext.Corners.Find(updateCornerSeatDto.CornerId);

            if (existingCorner == null)
            {
                return NotFound();
            }

            // Increase AvailableCapacity by the specified number
            existingCorner.AvailableCapacity += updateCornerSeatDto.SeatsToIncrease;

            _fanHubContext.SaveChanges();

            return Ok();
        }

        // ... (remaining code)


        public class UpdateCornerSeatDto
        {
            public int CornerId { get; set; }
            public int SeatsToIncrease { get; set; }
        }



        [HttpGet("GetDetailsFromCornerId")]
        public IActionResult GetDetailsFromCornerId(int cornerId, int ticketCategoryId)
        {
            var corner = _fanHubContext.Corners
                .Include(c => c.Race)
                    .ThenInclude(r => r.Season)
                .FirstOrDefault(c => c.CornerId == cornerId);

            if (corner == null)
            {
                return NotFound("Corner not found.");
            }

            var ticketCategory = _fanHubContext.TicketCategories
                .FirstOrDefault(tc => tc.TicketCategoryId == ticketCategoryId);

            if (ticketCategory == null)
            {
                return NotFound("Ticket category not found.");
            }

            var details = new
            {
                SeasonId = corner.Race.SeasonId,
                SeasonYear = corner.Race.Season.Year,
                RaceName = corner.Race.RaceName,
                RaceId = corner.RaceId,
                CornerId = corner.CornerId,
                CornerNumber = corner.CornerNumber,
                TicketCategoryName = ticketCategory.CategoryName
            };

            return Ok(details);
        }



        [HttpGet("GetSeasonIdAndRaceIdByCornerId")]
        public IActionResult GetSeasonIdAndRaceIdByCornerId(int cornerId)
        {
            var corner = _fanHubContext.Corners
                .Include(c => c.Race)
                .ThenInclude(r => r.Season)
                .FirstOrDefault(c => c.CornerId == cornerId);

            if (corner == null)
            {
                return NotFound("Corner not found.");
            }

            var seasonId = corner.Race.SeasonId;
            var raceId = corner.RaceId;

            var result = new
            {
                SeasonId = seasonId,
                RaceId = raceId
            };

            return Ok(result);
        }

    }
}