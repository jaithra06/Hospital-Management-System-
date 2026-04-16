namespace HospitalAPI.DTOs
{
    public class PatientRegisterDto
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int Age { get; set; }
        public string Gender { get; set; } = null!;
    }
}
