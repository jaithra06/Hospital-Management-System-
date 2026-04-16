using HospitalAPI.Models;

public class Patient
{
    public int PatientId { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; }

    public int UserId { get; set; }

    // ✅ REQUIRED
    public User User { get; set; }
}
