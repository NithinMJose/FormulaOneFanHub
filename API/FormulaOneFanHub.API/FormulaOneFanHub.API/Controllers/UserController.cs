using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;  
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net; // Add this namespace for BCrypt

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly IConfiguration _config;

        public UserController(FormulaOneFanHubContxt fanHubContxt, IConfiguration configuration)
        {
            _fanHubContext = fanHubContxt;
            _config = configuration;
        }

        [HttpPost("Login")]
        public IActionResult Authenticate(LoginDto loginDto)
        {
            User user = _fanHubContext.Users.FirstOrDefault(x => x.UserName == loginDto.UserName);
            if (user is null)
            {
                return Unauthorized();
            }

            // Verify the hashed password using BCrypt
            var isPasswordHashMatch = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
            if (!isPasswordHashMatch)
            {
                return Unauthorized();
            }

            var token = GenerateToken(user);
            // Return a JSON response with token and success:true
            return Ok(new { token = token, success = true });
        }

        private string GenerateToken(User user)
        {
            try
            {
                var claims = new[]
                {
            new Claim("userName", user.UserName),
            new Claim("RoleId", user.RoleId.ToString()) // Add RoleId claim
        };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(2), // Adjust the expiration time as needed
                    signingCredentials: credentials
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it) and return null or an error message
                return null;
            }
        }
        
        [HttpPost("Register")]
        public IActionResult Register(UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (userDto.Password != userDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            // Check if the username is already taken
            if (_fanHubContext.Users.Any(u => u.UserName == userDto.UserName))
            {
                return BadRequest("Username is already taken");
            }

            // Hash the password using BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var clientRole = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "user");

            User userToCreate = new User
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = passwordHash, // Store the hashed password
                RoleId = clientRole.Id,
                CreatedBy = "System",
                CreatedOn = DateTime.Now
            };
            _fanHubContext.Users.Add(userToCreate);
            _fanHubContext.SaveChanges();

            // Return a JSON response with success:true
            return Ok(new { success = true });
        }

        [HttpPost("UpdaterUser")]
        public IActionResult UpdateUser (UserUpdateDto  userUpdateDto)
        {
            if (!ModelState.IsValid)
            {   
                return BadRequest(ModelState);
            }

            // Find the user by userName
            var user = _fanHubContext.Users.FirstOrDefault(u => u.UserName == userUpdateDto.UserName);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update the user's properties
            user.Email = userUpdateDto.Email;
            user.FirstName = userUpdateDto.FirstName;
            user.LastName = userUpdateDto.LastName;

            // Save the changes to the database
            _fanHubContext.SaveChanges();

            // Return a JSON response with success:true
            return Ok(new { success = true });
        }
        
        
        [HttpPost("RegisterAdmin")]
        public IActionResult RegisterAdmin(UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var adminRole = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "Admin");

            // Hash the password using BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            User userToCreate = new User
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = passwordHash, // Store the hashed password
                RoleId = adminRole.Id,
                CreatedBy = "System",
                CreatedOn = DateTime.Now
            };
            _fanHubContext.Users.Add(userToCreate);
            _fanHubContext.SaveChanges();
            return StatusCode(201);
        }



            [HttpGet("GetAllUsers")]
            public IActionResult GetAllUsers()
            {
                List<User> users = _fanHubContext.Users.ToList();
                return Ok(users);
            }
        
            [HttpGet("viewProfile")]
            public IActionResult ViewProfile(string userName)
            {
                try
                {
                    
                    if (string.IsNullOrEmpty(userName))
                    {
                        return Unauthorized("Invalid token or user not found.");
                    }

                    // Find the user by Id
                    var user = _fanHubContext.Users.FirstOrDefault(u => u.UserName == userName);

                    if (user == null)
                    {
                        return NotFound("User not found.");
                    }
                
                    UserProfileDto userProfile = new()
                    {
                        UserName = user.UserName,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName
                    };


                    // Return the user's profile data
                    return Ok(userProfile);
                }
                catch (Exception ex)
                {
                    // Handle the exception (e.g., log it) and return an error response
                    return StatusCode(500, "An error occurred while processing the request.");
                }
            }

    }
}
