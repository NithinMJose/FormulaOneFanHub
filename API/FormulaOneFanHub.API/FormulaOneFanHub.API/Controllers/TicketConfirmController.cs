using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketConfirmController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public TicketConfirmController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpPost("ConfirmTickets")]
        public IActionResult ConfirmTickets([FromBody] ConfirmationDto confirmationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Retrieve data for confirmation based on provided IDs
            var season = _fanHubContext.Seasons.Find(confirmationDto.SeasonId);
            var race = _fanHubContext.Races.Find(confirmationDto.RaceId);
            var corner = _fanHubContext.Corners.Find(confirmationDto.CornerId);
            var ticketCategory = _fanHubContext.TicketCategories.Find(confirmationDto.TicketCategoryId);

            // Check if the entities are found
            if (season == null || race == null || corner == null || ticketCategory == null)
            {
                return NotFound("One or more entities not found.");
            }

            // Prepare the response data
            var confirmationResponse = new
            {
                Season = new { Year = season.Year, Champion = season.Champion },
                Race = new { RaceName = race.RaceName, RaceDate = race.RaceDate, RaceLocation = race.RaceLocation },
                Corner = new { CornerNumber = corner.CornerNumber, CornerCapacity = corner.CornerCapacity, AvailableCapacity = corner.AvailableCapacity },
                TicketCategory = new { CategoryName = ticketCategory.CategoryName, Description = ticketCategory.Description, TicketPrice = ticketCategory.TicketPrice }
            };

            return Ok(confirmationResponse);
        }
    }
}
