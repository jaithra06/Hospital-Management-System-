using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HospitalAPI.MongoModels;
using HospitalAPI.Services;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/medical-records")]

    public class MedicalRecordsController : ControllerBase
    {
        private readonly PatientRecordService _service;

        public MedicalRecordsController(PatientRecordService service)
        {
            _service = service;
        }

        // 👨‍⚕️ DOCTOR → Add medical record
        [Authorize(Roles = "DOCTOR")]
        [HttpPost]
        public IActionResult AddRecord([FromBody] PatientRecord record)
        {
            record.VisitDate = DateTime.Now;
            _service.Create(record);
            return Ok("Medical record added successfully");
        }

        // 👨‍⚕️ DOCTOR → View patient history
        [Authorize(Roles = "DOCTOR")]
        [HttpGet("patient/{patientId}")]
        public IActionResult GetPatientRecords(int patientId)
        {
            return Ok(_service.GetByPatient(patientId));
        }
    }
}
