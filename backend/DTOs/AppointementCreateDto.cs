namespace HospitalAPI.DTOs
{
    public class AppointmentCreateDto
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string ProblemDescription { get; set; } = null!;
    }
}
