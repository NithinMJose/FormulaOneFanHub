using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        public UserController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }
        [HttpPost("Login")]
        public IActionResult Authenticate(LoginDto loginDto)
        {
            User user = _fanHubContext.Users.SingleOrDefault(x => x.UserName == loginDto.UserName && x.Password == loginDto.Password);
            if (user == null)
            {
                return Unauthorized();
            }
            return Ok(user);

        }
        [HttpPost("Register")]
        public IActionResult Register(UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            User userToCreate = new User
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = userDto.Password,
                CreatedBy = "System",
                CreatedOn = DateTime.Now
            };
            _fanHubContext.Users.Add(userToCreate);
            _fanHubContext.SaveChanges();
            return StatusCode(201);

        }
    }
}
