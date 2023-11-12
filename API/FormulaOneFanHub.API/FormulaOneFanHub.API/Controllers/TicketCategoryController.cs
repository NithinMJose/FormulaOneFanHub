using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketCategoryController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public TicketCategoryController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpPost("InsertTicketCategory")]
        public IActionResult InsertTicketCategory([FromBody] TicketCategoryDto ticketCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticketCategoryToCreate = new TicketCategory
            {
                CategoryName = ticketCategoryDto.CategoryName,
                Description = ticketCategoryDto.Description,
                TicketPrice = ticketCategoryDto.TicketPrice
            };

            _fanHubContext.TicketCategories.Add(ticketCategoryToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetAllTicketCategories")]
        public IActionResult GetAllTicketCategories()
        {
            var ticketCategories = _fanHubContext.TicketCategories;
            return Ok(ticketCategories);
        }

        [HttpGet("GetTicketCategoryById")]
        public IActionResult GetTicketCategoryById(int id)
        {
            var ticketCategory = _fanHubContext.TicketCategories.Find(id);

            if (ticketCategory == null)
            {
                return NotFound();
            }

            return Ok(ticketCategory);
        }

        [HttpPut("UpdateTicketCategory")]
        public IActionResult UpdateTicketCategory([FromBody] TicketCategoryDto ticketCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTicketCategory = _fanHubContext.TicketCategories.Find(ticketCategoryDto.TicketCategoryId);

            if (existingTicketCategory == null)
            {
                return NotFound();
            }

            existingTicketCategory.CategoryName = ticketCategoryDto.CategoryName;
            existingTicketCategory.Description = ticketCategoryDto.Description;
            existingTicketCategory.TicketPrice = ticketCategoryDto.TicketPrice;

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpDelete("DeleteTicketCategory")]
        public IActionResult DeleteTicketCategory(int id)
        {
            var ticketCategoryToDelete = _fanHubContext.TicketCategories.Find(id);

            if (ticketCategoryToDelete == null)
            {
                return NotFound();
            }

            _fanHubContext.TicketCategories.Remove(ticketCategoryToDelete);
            _fanHubContext.SaveChanges();

            return Ok();
        }
    }
}
