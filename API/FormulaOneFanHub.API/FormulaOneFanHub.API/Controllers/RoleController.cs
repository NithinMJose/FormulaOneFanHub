    using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        public RoleController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }
        [HttpGet("GetRoles")]
        public IActionResult GetRoles()
        {
            var roles = _fanHubContext.Roles;
            return Ok(roles);
            
        }
        [HttpGet("GetRoleById")]
        public IActionResult GetRoleById(int id)
        {
            var role = _fanHubContext.Roles.Find(id);
            return Ok(role);
        }
        [HttpPost("CreateRole")]
        public IActionResult CreateRole(RoleDto roleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Role roleToCreate = new Role
            {
                RoleName = roleDto.RoleName,
                CreatedBy = "System",
                CreatedOn = DateTime.Now
            };
            _fanHubContext.Roles.Add(roleToCreate);
            _fanHubContext.SaveChanges();
            return StatusCode(201);
           
        }
        [HttpDelete("DeleteRole")]
        public IActionResult DeleteRole(int id)
        {
            var role = _fanHubContext.Roles.Find(id);
            if (role == null)
            {
                return NotFound();
            }
            _fanHubContext.Roles.Remove(role);
            _fanHubContext.SaveChanges();
            return Ok();
        }
    }
}
