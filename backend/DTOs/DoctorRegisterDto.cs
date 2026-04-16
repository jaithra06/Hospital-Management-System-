namespace HospitalAPI.DTOs
{
    public class DoctorRegisterDto
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Specialization { get; set; } = null!;
    }
}
