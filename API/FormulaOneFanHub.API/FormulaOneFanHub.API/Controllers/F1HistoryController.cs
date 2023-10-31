using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class F1HistoryController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public F1HistoryController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("CreateF1History")]
        public IActionResult CreateF1History([FromBody] F1History f1History)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _fanHubContext.F1Histories.Add(f1History);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetAllF1Histories")]
        public IActionResult GetAllF1Histories()
        {
            var f1Histories = _fanHubContext.F1Histories.ToList();
            return Ok(f1Histories);
        }

        [HttpGet("GetF1HistoryById")]
        public IActionResult GetF1HistoryById(int id)
        {
            var f1History = _fanHubContext.F1Histories.Find(id);

            if (f1History == null)
            {
                return NotFound();
            }

            return Ok(f1History);
        }

        [HttpPut("UpdateF1History")]
        public IActionResult UpdateF1History(int id, [FromBody] F1History f1History)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingF1History = _fanHubContext.F1Histories.Find(id);

            if (existingF1History == null)
            {
                return NotFound();
            }

            existingF1History.Heading = f1History.Heading;
            existingF1History.Paragraph = f1History.Paragraph;

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpDelete("DeleteF1History")]
        public IActionResult DeleteF1History(int id)
        {
            var f1History = _fanHubContext.F1Histories.Find(id);

            if (f1History == null)
            {
                return NotFound();
            }

            _fanHubContext.F1Histories.Remove(f1History);
            _fanHubContext.SaveChanges();

            return Ok();
        }
    }
}
