﻿using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
using FormulaOneFanHub.API.Entities;
using FormulaOneFanHub.API.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly IConfiguration _config;
        private readonly EmailSendUtility _emailSendUtility;

        public UserController(FormulaOneFanHubContxt fanHubContxt, IConfiguration configuration)
        {
            _fanHubContext = fanHubContxt;
            _config = configuration;
            _emailSendUtility = new EmailSendUtility(_config);
        }

        [HttpPost("Login")]
        public IActionResult Authenticate(LoginDto loginDto)
        {
              var user = _fanHubContext.Users
                 .Include(u => u.Role) // Include the Role in the query
                 .FirstOrDefault(x => x.UserName == loginDto.UserName);

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
                    new Claim("RoleId", user.Role?.RoleName!), 
                    new Claim(ClaimTypes.Role, user.Role?.RoleName!),
                    new Claim(ClaimTypes.Name, user.UserName)
                };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(30), // Adjust the expiration time as needed
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

            // Generate a random 7-digit number
            Random random = new Random();
            var randomCode = random.Next(1000000, 9999999);
            //convert the random number to string
            var Otp=randomCode.ToString();

            // Hash the password using BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            var OtpHash = BCrypt.Net.BCrypt.HashPassword(Otp);

            var clientRole = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "User");

            User userToCreate = new User
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = passwordHash, // Store the hashed password
                ConfirmEmailToken = OtpHash, // Use the random 7-digit number
                EmailConfirmed = false,
                RoleId = clientRole?.Id,
                CreatedBy = "System",
                Status = "inactive",
                CreatedOn = DateTime.Now
            };
            _fanHubContext.Users.Add(userToCreate);
            _fanHubContext.SaveChanges();

            //send verification email on successful registration
            _emailSendUtility.SendEmail(userToCreate,Otp);

            // Return a JSON response with success:true
            return Ok(new { success = true });
        }




        [HttpPost("ConfirmEmail")]
        public IActionResult ConfirmEmail(ConfirmEmailDto confirmEmailDto)
        {
            try
            {
                var user = _fanHubContext.Users
                    .Include(u => u.Role)
                    .FirstOrDefault(x => x.UserName == confirmEmailDto.UserName);

                if (user is null)
                {
                    return Unauthorized();
                }

                // Verify the hashed OTP using BCrypt
                var isOtpMatch = BCrypt.Net.BCrypt.Verify(confirmEmailDto.OtpToken, user.ConfirmEmailToken);
                if (!isOtpMatch)
                {
                    return Unauthorized();
                }

                // Update EmailConfirmed to true and remove the token if the OTP is valid
                user.EmailConfirmed = true;
                user.ConfirmEmailToken = null;
                user.Status = "active";
                _fanHubContext.SaveChanges();

                // Return a success response
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                // Handle any exceptions
                return StatusCode(500, "An error occurred while processing the request.");
            }
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
                Status = "active",
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

        [HttpDelete("DeleteUser")]
        public IActionResult DeleteUser(string userName)
        {
            try
            {
                var userToDelete = _fanHubContext.Users.FirstOrDefault(u => u.UserName == userName);

                if (userToDelete == null)
                {
                    return NotFound("User not found.");
                }

                _fanHubContext.Users.Remove(userToDelete);
                _fanHubContext.SaveChanges();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        [HttpPut("DeactivateUser")]
        public IActionResult DeactivateUser(string userName)
        {
            try
            {
                var userToDeactivate = _fanHubContext.Users.FirstOrDefault(u => u.UserName == userName);

                if (userToDeactivate == null)
                {
                    return NotFound("User not found.");
                }

                // Assuming 'Status' is a field in your User model
                userToDeactivate.Status = "inactive"; // Set the status to inactive

                _fanHubContext.SaveChanges();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }


        [HttpPut("ActivateUser")]
        public IActionResult ActivateUser(string userName)
        {
            try
            {
                var userToActivate = _fanHubContext.Users.FirstOrDefault(u => u.UserName == userName);

                if (userToActivate == null)
                {
                    return NotFound("User not found.");
                }

                // Assuming 'Status' is a field in your User model
                userToActivate.Status = "active"; // Set the status to inactive

                _fanHubContext.SaveChanges();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }



        [HttpPost("UpgradeUser")]
        public IActionResult UpgradeUser(string userName)
        {
            try
            {
                // Find the user by userName
                var user = _fanHubContext.Users.FirstOrDefault(u => u.UserName == userName);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Get the RoleId for "admin"
                var adminRoleId = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "Admin")?.Id;

                if (adminRoleId == null)
                {
                    return StatusCode(500, "Admin role not found.");
                }

                // Upgrade the user's RoleId to adminRoleId
                user.RoleId = adminRoleId.Value;

                // Save the changes to the database
                _fanHubContext.SaveChanges();

                // Return a JSON response with success:true
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the request.");
            }
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
