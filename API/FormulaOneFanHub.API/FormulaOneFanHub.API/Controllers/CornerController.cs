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
                RaceId = cornerDto.RaceId
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
        public IActionResult UpdateCorner([FromBody] CornerDto cornerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCorner = _fanHubContext.Corners.Find(cornerDto.CornerId);

            if (existingCorner == null)
            {
                return NotFound();
            }

            existingCorner.CornerNumber = cornerDto.CornerNumber;
            existingCorner.CornerCapacity = cornerDto.CornerCapacity;
            existingCorner.RaceId = cornerDto.RaceId;

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
    }
}