using Microsoft.AspNetCore.Mvc;
using System.Linq;
using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public VoteController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpGet("GetVotesByPoll")]
        public IActionResult GetVotesByPoll(int pollId)
        {
            var votes = _fanHubContext.Votes.Where(v => v.PollId == pollId).ToList();

            return Ok(votes);
        }
    }
}
