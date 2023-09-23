using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly IConfiguration  _config;

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
            var decodedPasswordHash = Convert.FromBase64String(user.Password);
            var isPasswordHashMatch = VerifyHashedPassword(user.Password, loginDto.Password);
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
                var claims = new[] { new Claim(ClaimTypes.Name, user.UserName) };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(15), // Adjust the expiration time as needed
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

            var passwordHash = HashPassword(userDto.Password);

            var clientRole = _fanHubContext.Roles.SingleOrDefault(x => x.RoleName == "Client");
            
            
            User userToCreate = new User
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = passwordHash,
                RoleId = clientRole.Id,
                CreatedBy = "System",
                CreatedOn = DateTime.Now
            };
            _fanHubContext.Users.Add(userToCreate);
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
            User userToCreate = new User
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = userDto.Password,
                RoleId = adminRole.Id,
                CreatedBy = "System",
                CreatedOn = DateTime.Now
            };
            _fanHubContext.Users.Add(userToCreate);
            _fanHubContext.SaveChanges();
            return StatusCode(201);
        }

        private static string HashPassword(string password)
        {
            KeyDerivationPrf
                prf = KeyDerivationPrf.HMACSHA512;
            int iterCount = 100000;
            int saltSize = 128 / 8;
            int numBytesRequested = 256 / 8;
            byte[] salt = new byte[saltSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            byte[] subkey = KeyDerivation.Pbkdf2(
                               password: password,
                                              salt: salt,
                                                             prf: prf,
                                                                            iterationCount: iterCount,
                                                                                           numBytesRequested: numBytesRequested);
            var outputBytes = new byte[13 + salt.Length + subkey.Length];
            outputBytes[0] = 0x01; // format marker
            WriteNetworkByteOrder(outputBytes, 1, (uint)prf);
            WriteNetworkByteOrder(outputBytes, 5, (uint)iterCount);
                
            WriteNetworkByteOrder(outputBytes, 9, (uint)saltSize);
            Buffer.BlockCopy(salt, 0, outputBytes, 13, salt.Length);
            Buffer.BlockCopy(subkey, 0, outputBytes, 13 + saltSize, subkey.Length);
            return Convert.ToBase64String(outputBytes);
        }

        private static void WriteNetworkByteOrder(byte[] buffer, int offset, uint value)
        {
            buffer[offset + 0] = (byte)(value >> 24);
            buffer[offset + 1] = (byte)(value >> 16);
            buffer[offset + 2] = (byte)(value >> 8);
            buffer[offset + 3] = (byte)(value >> 0);

        }

       private static bool VerifyHashedPassword(string hashedPassword, string password)
        {
            byte[] decodedHashedPassword = Convert.FromBase64String(hashedPassword);
            if (decodedHashedPassword.Length == 0)
            {
                return false; // Bad format
            }
            try
            {
                // Read header information
                KeyDerivationPrf prf = (KeyDerivationPrf)ReadNetworkByteOrder(decodedHashedPassword, 1);
                int iterCount = (int)ReadNetworkByteOrder(decodedHashedPassword, 5);
                int saltLength = (int)ReadNetworkByteOrder(decodedHashedPassword, 9);
                // Read the salt: must be >= 128 bits
                if (saltLength < 128 / 8)
                {
                    return false; // Bad format
                }
                byte[] salt = new byte[saltLength];
                Buffer.BlockCopy(decodedHashedPassword, 13, salt, 0, salt.Length);
                // Read the subkey (the rest of the payload): must be >= 128 bits
                int subkeyLength = decodedHashedPassword.Length - 13 - salt.Length;
                if (subkeyLength < 128 / 8)
                {
                    return false; // Bad format
                }
                byte[] expectedSubkey = new byte[subkeyLength];
                Buffer.BlockCopy(decodedHashedPassword, 13 + salt.Length, expectedSubkey, 0, expectedSubkey.Length);
                // Hash the incoming password and verify it
                byte[] actualSubkey = KeyDerivation.Pbkdf2(password, salt, prf, iterCount, subkeyLength);
                return CryptographicOperations.FixedTimeEquals(actualSubkey, expectedSubkey);
            }
            catch
            {
                // This should never occur except in the case of a malformed payload, where
                // we might go off the end of the array. Regardless, a malformed payload
                // implies verification failed.
                return false;
            }
        }

        private static uint ReadNetworkByteOrder(byte[] buffer, int offset)
        {
            return ((uint)buffer[offset + 0] << 24)
                   | ((uint)buffer[offset + 1] << 16)
                   | ((uint)buffer[offset + 2] << 8)
                   | ((uint)buffer[offset + 3]);
        }

        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            List<User> users = _fanHubContext.Users.ToList();
            return Ok(users);
        }
    }
}
