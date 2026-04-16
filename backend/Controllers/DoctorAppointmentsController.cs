using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using System.Security.Claims;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/doctor/appointments")]
    [Authorize(Roles = "DOCTOR")]
    public class DoctorAppointmentsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public DoctorAppointmentsController(HospitalDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET APPROVED APPOINTMENTS (LOGGED-IN DOCTOR ONLY)
        // =====================================================
        [HttpGet]
        public IActionResult GetApprovedAppointments()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var doctor = _context.Doctors
                .FirstOrDefault(d => d.UserId == userId);

            if (doctor == null)
                return NotFound("Doctor not found");

            var appointments = _context.Appointments
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .Where(a =>
                    a.DoctorId == doctor.DoctorId &&
                    a.Status == "APPROVED"
                )
                .Select(a => new
                {
                    a.AppointmentId,
                    PatientName = a.Patient.User.Name,
                    a.AppointmentDate,
                    a.ProblemDescription,
                    a.Status
                })
                .ToList();

            return Ok(appointments);
        }

        // =====================================================
        // MARK APPOINTMENT AS COMPLETED
        // =====================================================
        [HttpPut("{appointmentId}/complete")]
        public IActionResult CompleteAppointment(int appointmentId)
        {
            var appointment = _context.Appointments
                .FirstOrDefault(a => a.AppointmentId == appointmentId);

            if (appointment == null)
                return NotFound("Appointment not found");

            appointment.Status = "COMPLETED";
            _context.SaveChanges();

            return Ok("Appointment marked as completed");
        }
    }
}
