using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SoldItemController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _context;

        public SoldItemController(FormulaOneFanHubContxt context)
        {
            _context = context;
        }

        [HttpGet("GetSoldItemHistoryByTeam/{teamId}")]
        public IActionResult GetSoldItemHistoryByTeam(int teamId)
        {
            var soldItemHistory = _context.SoldItems
                .Include(s => s.Product)
                .Where(s => s.TeamId == teamId)
                .Select(s => new
                {
                    s.SoldItemId,
                    s.ProductId,
                    ProductName = s.Product.ProductName,
                    ImagePath = s.Product.ImagePath1,
                    s.Quantity,
                    s.PricePerItem,
                    s.TotalPrice,
                    s.SoldDate,
                    s.Status
                })
                .ToList();

            return Ok(soldItemHistory);
        }
    }
}
