using System;

namespace FormulaOneFanHub.API.Entities
{
    public class AttendanceRegister
    {
        public int AttendanceRegisterId { get; set; }
        public string EmployeeId { get; set; }
        public DateTime InTime { get; set; }
        public DateTime? OutTime { get; set; }
        public TimeSpan? WorkTime { get; set; }

    }
}
