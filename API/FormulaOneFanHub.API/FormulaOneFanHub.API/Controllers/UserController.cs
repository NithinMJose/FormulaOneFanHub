using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
using FormulaOneFanHub.API.Entities;
using FormulaOneFanHub.API.Utilities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static System.Net.WebRequestMethods;

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



        //////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                return Ok(new { message = "Wrong password" });
            }

            if (user.Status != "active")
            {
                // If the user status is inactive, return a response with "inactive"
                return Ok(new { status = "inactive" });
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
                    new Claim("Status", user.Status!),
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



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////


        // UserController.cs
        [HttpPost("RegisterUser")]
        public IActionResult RegisterUser(RegDto regDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (regDto.Password != regDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            // Check if the username is already taken
            if (_fanHubContext.Users.Any(u => u.UserName == regDto.UserName))
            {
                return BadRequest("Username is already taken");
            }

            // Hash the password using BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(regDto.Password);

            var clientRole = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "User");

            User userToCreate = new User
            {
                UserName = regDto.UserName,
                Email = regDto.Email,
                FirstName = regDto.FirstName,
                LastName = regDto.LastName,
                Password = passwordHash, // Store the hashed password
                EmailConfirmed = true,
                Address = regDto.Address,
                ContactNumber = regDto.ContactNumber,
                RoleId = clientRole?.Id,
                CreatedBy = "System",
                Status = "active",
                CreatedOn = DateTime.Now
            };
            _fanHubContext.Users.Add(userToCreate);
            _fanHubContext.SaveChanges();

            // Return a JSON response with success:true
            return Ok(new { success = true });
        }



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //[HttpPost("TestEndPoint")]
        //public IActionResult TestEndPoint(UserDto userDto)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (userDto.Password != userDto.ConfirmPassword)
        //    {
        //        return BadRequest("Passwords do not match");
        //    }

        //    // Check if the username is already taken
        //    if (_fanHubContext.Users.Any(u => u.UserName == userDto.UserName))
        //    {
        //        return BadRequest("Username is already taken");
        //    }

        //    // Generate a random 7-digit number
        //    Random random = new Random();
        //    var randomCode = random.Next(1000000, 9999999);
        //    // Convert the random number to a string
        //    var Otp = randomCode.ToString();

        //    var clientRole = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "User");

        //    User userToCreate = new User
        //    {
        //        UserName = userDto.UserName,
        //        Email = userDto.Email,
        //        FirstName = userDto.FirstName,
        //        LastName = userDto.LastName,
        //        Password = userDto.Password, 
        //        EmailConfirmed = false,
        //        RoleId = clientRole?.Id,
        //        CreatedBy = "System",
        //        Status = "inactive",
        //        CreatedOn = DateTime.Now
        //    };

        //    // Send verification email on successful registration
        //    _emailSendUtility.SendEmail(userToCreate, Otp);

        //    // Return a JSON response with success:true and user data
        //    return Ok(new { success = true, user = userToCreate });
        //}

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
        


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        
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
                ContactNumber = userDto.ContactNumber,
                Address = userDto.Address,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = passwordHash, // Store the hashed password
                RoleId = adminRole.Id,
                Status = "active",
                CreatedBy = "System",
                CreatedOn = DateTime.Now,
                EmailConfirmed = true
            };
            _fanHubContext.Users.Add(userToCreate);
            _fanHubContext.SaveChanges();
            return StatusCode(201);
        }


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            [HttpGet("GetAllUsers")]
            public IActionResult GetAllUsers()
            {
                List<User> users = _fanHubContext.Users.ToList();
                return Ok(users);
            }



        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
      
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpPost("SendOtp")]
        public IActionResult SendOtp([FromBody] UserNameRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest("Invalid request format. Please provide a JSON object with 'userName' field.");
                }

                // Find the user by userName
                var user = _fanHubContext.Users.FirstOrDefault(u => u.UserName == request.UserName);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Generate a random 7-digit number
                Random random = new Random();
                var randomCode = random.Next(1000000, 9999999);
                // Convert the random number to a string
                var otp = randomCode.ToString();

                // Store the OTP in the ConfirmEmailToken field
                // Save the changes to the database
                _fanHubContext.SaveChanges();

                // Send the OTP to the user's email (you can implement this logic using your email sending utility)
                _emailSendUtility.SendEmail(user, otp);

                // Return a JSON response with success:true
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it) and return an error response
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        public class UserNameRequest
        {
            public string UserName { get; set; }
        }



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        [HttpPost("VerifyOtp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpDto verifyOtpDto)
        {
            try
            {
                // Find the user by userName
                var user = _fanHubContext.Users.FirstOrDefault(u => u.UserName == verifyOtpDto.UserName);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Check if the OTP matches the stored ConfirmEmailToken

                // Clear the ConfirmEmailToken as it's verified

                // Update the EmailConfirmed field to true or perform any other necessary logic
                user.EmailConfirmed = true;

                // Save the changes to the database
                _fanHubContext.SaveChanges();

                // Return a JSON response with success:true
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it) and return an error response
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        



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


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        [HttpPost("UpdatePassword")]
        public IActionResult UpdatePassword([FromBody] UpdatePasswordRequest request)
        {
            try
            {
                // Find the user by username
                var user = _fanHubContext.Users.FirstOrDefault(u => u.UserName == request.UserName);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Hash the new password using BCrypt
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

                // Update the password field in the User table
                user.Password = passwordHash;

                // Save the changes to the database
                _fanHubContext.SaveChanges();

                // Return a JSON response with success:true
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it) and return an error response
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        public class UpdatePasswordRequest
        {
            public string UserName { get; set; }
            public string NewPassword { get; set; }
        }



        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        [HttpPost("RegisterOne")]
        public IActionResult RegisterOne(RegisterOneRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            // Check if the username is already taken
            if (_fanHubContext.Users.Any(u => u.UserName == request.UserName))
            {
                return BadRequest(new { message = "Username is already taken" });
            }

            // Generate a random 7-digit number
            Random random = new Random();
            var randomCode = random.Next(1000000, 9999999);
            // Convert the random number to a string
            var otpServer = randomCode.ToString();

            var clientRole = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "User");

            User userToCreate = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Password = request.Password,
                EmailConfirmed = true,
                ContactNumber = request.ContactNumber,
                Address = request.Address,
                RoleId = clientRole?.Id,
                CreatedBy = "System",
                Status = "inactive",
                CreatedOn = DateTime.Now
            };

            // Send verification email on successful registration
            _emailSendUtility.SendEmail(userToCreate, otpServer);

            // Return a JSON response with success:true and user data
            return Ok(new { success = true, user = new { userToCreate.UserName, userToCreate.FirstName ,userToCreate.LastName, userToCreate.Email, otpServer } });
        }

        public class RegisterOneRequest
        {
            public string UserName { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string ConfirmPassword { get; set; }
            public string ContactNumber { get; set; }
            public string Address { get; set; }

        }

        [HttpGet("CheckUsernameAvailability")]
        public IActionResult CheckUsernameAvailability(string username)
        {
            bool isUsernameTaken = _fanHubContext.Users.Any(u => u.UserName == username);
            return Ok(new { isUsernameTaken });
        }


    }
}


