using HospitalAPI.Models;

public class Doctor
{
    public int DoctorId { get; set; }
    public string Specialization { get; set; }

    public int UserId { get; set; }

    // ✅ REQUIRED
    public User User { get; set; }
}
