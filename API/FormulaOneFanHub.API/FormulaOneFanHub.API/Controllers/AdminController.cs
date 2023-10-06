using FormulaOneFanHub.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public AdminController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpGet("ListUsers")]
        public IActionResult ListUsers()
        {
            var clientRole = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "User");

            if (clientRole == null)
            {
                return NotFound();
            }

            var users = _fanHubContext.Users
                .Where(u => u.RoleId == clientRole.Id)
                .Select(u => new
                {
                    u.UserName,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.CreatedOn,
                    u.CreatedBy,
                    // Add other properties you want to include
                })
                .ToList();

            return Ok(users);
        }
    }
}