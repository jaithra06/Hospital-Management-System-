using HospitalAPI.MongoModels;
using MongoDB.Driver;

namespace HospitalAPI.Services
{
    public class PatientRecordService
    {
        private readonly IMongoCollection<PatientRecord> _collection;

        public PatientRecordService(IConfiguration configuration)
        {
            var client = new MongoClient(
                configuration["MongoDB:ConnectionString"]
            );

            var database = client.GetDatabase(
                configuration["MongoDB:DatabaseName"]
            );

            _collection = database.GetCollection<PatientRecord>(
                configuration["MongoDB:CollectionName"]
            );
        }

        public void Create(PatientRecord record)
        {
            _collection.InsertOne(record);
        }

        public List<PatientRecord> GetByPatient(int patientId)
        {
            return _collection
                .Find(r => r.PatientId == patientId)
                .ToList();
        }
    }
}
