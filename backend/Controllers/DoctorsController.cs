using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/doctors")]
    [Authorize(Roles = "PATIENT")]
    public class DoctorsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public DoctorsController(HospitalDbContext context)
        {
            _context = context;
        }

        // =========================================
        // GET ALL DOCTORS (FOR PATIENT BOOKING)
        // =========================================
        [HttpGet]
        public IActionResult GetDoctors()
        {
            var doctors = _context.Doctors
                .Include(d => d.User)
                .Select(d => new
                {
                    d.DoctorId,
                    DoctorName = d.User.Name,
                    d.Specialization
                })
                .ToList();

            return Ok(doctors);
        }
    }
}
