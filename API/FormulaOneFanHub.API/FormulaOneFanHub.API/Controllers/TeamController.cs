using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly IConfiguration _config;

        public TeamController(FormulaOneFanHubContxt fanHubContext, IConfiguration configuration)
        {
            _fanHubContext = fanHubContext;
            _config = configuration;
        }

        [HttpPost("Login")]
        public IActionResult Authenticate(LoginDto loginDto)
        {
            var team = _fanHubContext.Teams.FirstOrDefault(x => x.userName == loginDto.UserName);

            if (team is null)
            {
                return Unauthorized();
            }

            var isPasswordMatch = BCrypt.Net.BCrypt.Verify(loginDto.Password, team.Password);

            if (!isPasswordMatch)
            {
                return Ok(new { message = "Wrong password" });
            }

            var token = GenerateToken(team);

            // Always return success:true even if the status is inactive
            return Ok(new { token = token, success = true });
        }


        private string GenerateToken(Team team)
        {
            try
            {
                var claims = new[]
                {
                    new Claim("userName", team.userName),
                    new Claim("teamId", team.Id.ToString()),
                    new Claim("Status", team.Status!),
                    new Claim(ClaimTypes.Name, team.userName),
                    new Claim("RoleId", "Team")
                };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(3000),
                    signingCredentials: credentials
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it)
                return null;
            }
        }

        [HttpPost("CreateTeam")]
        public IActionResult CreateTeam([FromBody] TeamCreateDto teamCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Generate a random 10-character password
            string generatedPassword = GenerateRandomPassword(10);

            // Hash the generated password using BCrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(generatedPassword);

            // Handle default values for other properties
            Team teamToCreate = new Team
            {
                userName = teamCreateDto.UserName,
                Email = teamCreateDto.Email,
                Password = hashedPassword, // Set hashed password
                Status = "inactive", // Set default value for Status
                CreatedOn = DateTime.Now, // Set default value for CreatedOn
                UpdatedOn = DateTime.Now // Set default value for UpdatedOn
            };

            _fanHubContext.Teams.Add(teamToCreate);
            _fanHubContext.SaveChanges();

            // Send email to the user with the generated password
            SendEmailOnCreate(teamToCreate, generatedPassword);

            // Return the generated password
            return StatusCode(201, new { GeneratedPassword = generatedPassword });
        }

        private void SendEmailOnCreate(Team teamInfo, string generatedPassword)
        {
            try
            {
                var emailApiKey = _config["EmailServer:SENDGRID_API_KEY"];
                var client = new SendGridClient(emailApiKey);
                var from = new EmailAddress("nithinjosemandownloadonly@gmail.com", "FormulaOneFanHub");
                var subject = "Your team account is created with FormulaOne FanHub : Here is your password";
                var to = new EmailAddress(teamInfo.Email, teamInfo.userName);

                // Send the generated password and username as email body
                var plainTextContent = $"Username: {teamInfo.userName}\nPassword: {generatedPassword}";
                var htmlContent = $"<strong>Your team account is created successfully with FormulaOneFanHub.</strong><br/><br/><strong>Username:</strong> {teamInfo.userName}<br/><strong>Password:</strong> {generatedPassword}";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = client.SendEmailAsync(msg).GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it)
            }
        }


        private string GenerateRandomPassword(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }


        [HttpGet("GetTeams")]
        public IActionResult GetTeams()
        {
            var teams = _fanHubContext.Teams;
            return Ok(teams);
        }

        [HttpGet("GetTeamById")]
        public IActionResult GetTeamById(int id)
        {
            var team = _fanHubContext.Teams.Find(id);
            return Ok(team);
        }

        [HttpGet("GetTeamNameOnly")]
        public IActionResult GetTeamNameOnly()
        {
            var teamNames = _fanHubContext.Teams.Select(team => team.userName);
            return Ok(teamNames);
        }

        [HttpGet("GetIdByUserName")]
        public IActionResult GetIdByUserName(string userName)
        {
            if (string.IsNullOrEmpty(userName))
            {
                return BadRequest("Username cannot be empty.");
            }

            var team = _fanHubContext.Teams.FirstOrDefault(x => x.userName == userName);

            if (team == null)
            {
                return NotFound("Team not found for the given username.");
            }

            return Ok(new { TeamId = team.Id });
        }

        [HttpGet("GetTeamByUserName")]
        public IActionResult GetTeamByUserName(string userName)
        {
            if (string.IsNullOrEmpty(userName))
            {
                return BadRequest("Username cannot be empty.");
            }

            var team = _fanHubContext.Teams.FirstOrDefault(x => x.userName == userName);

            if (team == null)
            {
                return NotFound("Team not found for the given username.");
            }

            return Ok(team);
        }


        [HttpPut("UpdateTeam")]
        public IActionResult UpdateTeam(int teamId, [FromForm] TeamUpdateDto teamUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var team = _fanHubContext.Teams.FirstOrDefault(t => t.Id == teamId);

            if (team == null)
            {
                return NotFound("Team not found.");
            }

            // Update the team's properties
            team.Name = teamUpdateDto.Name;
            team.PhoneNumber = teamUpdateDto.PhoneNumber;
            team.Address1 = teamUpdateDto.Address1;
            team.Address2 = teamUpdateDto.Address2;
            team.Address3 = teamUpdateDto.Address3;
            team.Country = teamUpdateDto.Country;
            team.TeamPrincipal = teamUpdateDto.TeamPrincipal;
            team.TechnicalChief = teamUpdateDto.TechnicalChief;
            team.EngineSupplier = teamUpdateDto.EngineSupplier;
            team.Chassis = teamUpdateDto.Chassis;

           

            team.UpdatedOn = DateTime.Now;

            // Save the changes to the database
            _fanHubContext.SaveChanges();

            // Return a JSON response with success:true
            return Ok(new { success = true });
        }


    }
}
