using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.DTOs;
using HospitalAPI.Models;
using System.Security.Claims;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/v1/appointments")]
    public class AppointmentsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public AppointmentsController(HospitalDbContext context)
        {
            _context = context;
        }

        // =========================
        // PATIENT → BOOK APPOINTMENT
        // =========================
        [Authorize(Roles = "PATIENT")]
        [HttpPost("book")]
        public IActionResult BookAppointment(AppointmentCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var patient = _context.Patients.First(p => p.UserId == userId);

            bool slotTaken = _context.Appointments.Any(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate == dto.AppointmentDate &&
                a.Status != "REJECTED"
            );

            if (slotTaken)
                return BadRequest("This slot is already booked");

            var appointment = new Appointment
            {
                DoctorId = dto.DoctorId,
                PatientId = patient.PatientId,
                AppointmentDate = dto.AppointmentDate,
                ProblemDescription = dto.ProblemDescription,
                Status = "PENDING"
            };

            _context.Appointments.Add(appointment);
            _context.SaveChanges();

            return Ok("Appointment request sent");
        }

        // =========================
        // PATIENT → MY APPOINTMENTS
        // =========================
        [Authorize(Roles = "PATIENT")]
        [HttpGet("my")]
        public IActionResult MyAppointments()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var patient = _context.Patients.First(p => p.UserId == userId);

            var appointments = _context.Appointments
                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
                .Where(a => a.PatientId == patient.PatientId)
                .Select(a => new
                {
                    a.AppointmentId,
                    DoctorName = a.Doctor.User.Name,
                    a.Doctor.Specialization,
                    a.AppointmentDate,
                    a.Status,
                    a.ProblemDescription
                })
                .ToList();

            return Ok(appointments);
        }

        // =========================
        // PATIENT → AVAILABLE SLOTS  ✅ THIS MUST APPEAR IN SWAGGER
        // =========================
        [Authorize(Roles = "PATIENT")]
        [HttpGet("slots/{doctorId}")]
        public IActionResult GetAvailableSlots(int doctorId, [FromQuery] DateTime date)
        {
            var allSlots = new List<TimeSpan>
            {
                new TimeSpan(9,0,0),
                new TimeSpan(9,30,0),
                new TimeSpan(10,0,0),
                new TimeSpan(10,30,0),
                new TimeSpan(11,0,0)
            };

            var bookedSlots = _context.Appointments
                .Where(a =>
                    a.DoctorId == doctorId &&
                    a.AppointmentDate.Date == date.Date &&
                    a.Status != "REJECTED")
                .Select(a => a.AppointmentDate.TimeOfDay)
                .ToList();

            var availableSlots = allSlots
                .Where(s => !bookedSlots.Contains(s))
                .Select(s => s.ToString(@"hh\:mm"))
                .ToList();

            return Ok(availableSlots);
        }
    }
}
