using System;

namespace HospitalAPI.Models
{
    public class Appointment
    {
        public int AppointmentId { get; set; }

        // Doctor
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        // Patient
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        // Appointment details
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = "PENDING";

        // ✅ NEW FIELD (IMPORTANT)
        public string ProblemDescription { get; set; } = null!;
    }
}
