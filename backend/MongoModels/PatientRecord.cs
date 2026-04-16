using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HospitalAPI.MongoModels
{
    public class PatientRecord
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime VisitDate { get; set; }
        public string? Diagnosis { get; set; }
        public string? Prescription { get; set; }
        public string? Notes { get; set; }
    }
}
