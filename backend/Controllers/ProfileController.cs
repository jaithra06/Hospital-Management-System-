using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public ProfileController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public IActionResult GetMyProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)!.Value;

            // 🧑‍🦽 PATIENT PROFILE
            if (role == "PATIENT")
            {
                var patient = _context.Patients
                    .Include(p => p.User)
                    .FirstOrDefault(p => p.UserId == userId);

                if (patient == null || patient.User == null)
                    return BadRequest("Patient profile not linked");

                return Ok(new
                {
                    Name = patient.User.Name,
                    Email = patient.User.Email,
                    Role = "PATIENT",
                    Age = patient.Age,
                    Gender = patient.Gender
                });
            }

            // 👨‍⚕️ DOCTOR PROFILE
            if (role == "DOCTOR")
            {
                var doctor = _context.Doctors
                    .Include(d => d.User)
                    .FirstOrDefault(d => d.UserId == userId);

                if (doctor == null || doctor.User == null)
                    return BadRequest("Doctor profile not linked");

                return Ok(new
                {
                    Name = doctor.User.Name,
                    Email = doctor.User.Email,
                    Role = "DOCTOR",
                    Specialization = doctor.Specialization
                });
            }

            // 🛠️ ADMIN PROFILE
            if (role == "ADMIN")
            {
                var admin = _context.Users
                    .Where(u => u.UserId == userId)
                    .Select(u => new
                    {
                        Name = u.Name ?? "System Administrator",
                        Email = u.Email,
                        Role = "ADMIN"
                    })
                    .FirstOrDefault();

                if (admin == null)
                    return NotFound("Admin profile not found");

                return Ok(admin);
            }

            return BadRequest("Invalid role");
        }
    }
}
