using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/admin")]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public AdminController(HospitalDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // 📊 ADMIN DASHBOARD COUNTS
        // =====================================================
        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            return Ok(new
            {
                doctors = _context.Doctors.Count(),
                patients = _context.Patients.Count(),
                appointments = _context.Appointments.Count(),
                pendingAppointments = _context.Appointments.Count(a => a.Status == "PENDING")
            });
        }

        // =====================================================
        // 👨‍⚕️ VIEW ALL DOCTORS
        // =====================================================
        [HttpGet("doctors")]
        public IActionResult GetDoctors()
        {
            var doctors = _context.Doctors
                .Include(d => d.User)
                .Select(d => new
                {
                    d.DoctorId,
                    Name = d.User.Name,
                    Email = d.User.Email,
                    d.Specialization
                })
                .ToList();

            return Ok(doctors);
        }

        // =====================================================
        // 🧑‍🦽 VIEW ALL PATIENTS
        // =====================================================
        [HttpGet("patients")]
        public IActionResult GetPatients()
        {
            var patients = _context.Patients
                .Include(p => p.User)
                .Select(p => new
                {
                    p.PatientId,
                    Name = p.User.Name,
                    Email = p.User.Email,
                    p.Age,
                    p.Gender
                })
                .ToList();

            return Ok(patients);
        }

        // =====================================================
        // 🗑️ DELETE DOCTOR
        // =====================================================
        [HttpDelete("doctor/{id}")]
        public IActionResult DeleteDoctor(int id)
        {
            var doctor = _context.Doctors.FirstOrDefault(d => d.DoctorId == id);
            if (doctor == null)
                return NotFound("Doctor not found");

            var user = _context.Users.Find(doctor.UserId);

            _context.Doctors.Remove(doctor);
            if (user != null) _context.Users.Remove(user);

            _context.SaveChanges();
            return Ok("Doctor deleted successfully");
        }

        // =====================================================
        // 🗑️ DELETE PATIENT
        // =====================================================
        [HttpDelete("patient/{id}")]
        public IActionResult DeletePatient(int id)
        {
            var patient = _context.Patients.FirstOrDefault(p => p.PatientId == id);
            if (patient == null)
                return NotFound("Patient not found");

            var user = _context.Users.Find(patient.UserId);

            _context.Patients.Remove(patient);
            if (user != null) _context.Users.Remove(user);

            _context.SaveChanges();
            return Ok("Patient deleted successfully");
        }

        // =====================================================
        // 📋 VIEW ALL PENDING APPOINTMENTS (WITH NAMES)
        // =====================================================
        [HttpGet("appointments/pending")]
        public IActionResult GetPendingAppointments()
        {
            var appointments = _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Where(a => a.Status == "PENDING")
                .Select(a => new
                {
                    a.AppointmentId,
                    PatientName = a.Patient.User.Name,
                    DoctorName = a.Doctor.User.Name,
                    a.Doctor.Specialization,
                    a.AppointmentDate,
                    a.ProblemDescription,
                    a.Status
                })
                .ToList();

            return Ok(appointments);
        }

        // =====================================================
        // ✅ APPROVE APPOINTMENT
        // =====================================================
        [HttpPut("appointments/{id}/approve")]
        public IActionResult ApproveAppointment(int id)
        {
            var appointment = _context.Appointments.Find(id);
            if (appointment == null)
                return NotFound("Appointment not found");

            appointment.Status = "APPROVED";
            _context.SaveChanges();

            return Ok("Appointment approved");
        }

        // =====================================================
        // ❌ REJECT APPOINTMENT
        // =====================================================
        [HttpPut("appointments/{id}/reject")]
        public IActionResult RejectAppointment(int id)
        {
            var appointment = _context.Appointments.Find(id);
            if (appointment == null)
                return NotFound("Appointment not found");

            appointment.Status = "REJECTED";
            _context.SaveChanges();

            return Ok("Appointment rejected");
        }
    }
}
