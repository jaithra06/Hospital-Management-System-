using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Data;
using HospitalAPI.DTOs;
using HospitalAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace HospitalAPI.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/auth")]
    public class AuthController : ControllerBase
    {
        private readonly HospitalDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(HospitalDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // 🔐 LOGIN API
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            if (dto.Email == null || dto.Password == null)
                return BadRequest("Email and Password are required");

            var user = _context.Users
                .FirstOrDefault(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid email or password");

            // Hash incoming password
            var hashedPassword = HashPassword(dto.Password);

            if (user.PasswordHash != hashedPassword)
                return Unauthorized("Invalid email or password");

            // Generate JWT
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successful",
                token = token,
                role = user.Role,
                userId = user.UserId
            });
        }

        // 🔑 JWT TOKEN GENERATION
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Role, user.Role!)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(
                    Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // 🔒 PASSWORD HASHING (SHA256)
        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
        [HttpPost("register/patient")]
        public IActionResult RegisterPatient([FromBody] PatientRegisterDto dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = "PATIENT"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var patient = new Patient
            {
                UserId = user.UserId,
                Age = dto.Age,
                Gender = dto.Gender
            };

            _context.Patients.Add(patient);
            _context.SaveChanges();

            return Ok("Patient registered successfully");
        }
        [HttpPost("register/doctor")]
        public IActionResult RegisterDoctor([FromBody] DoctorRegisterDto dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = "DOCTOR"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var doctor = new Doctor
            {
                UserId = user.UserId,
                Specialization = dto.Specialization
            };

            _context.Doctors.Add(doctor);
            _context.SaveChanges();

            return Ok("Doctor registered successfully");
        }



    }
}
