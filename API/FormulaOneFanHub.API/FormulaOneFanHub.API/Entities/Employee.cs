using System;

namespace FormulaOneFanHub.API.Entities
{
    public class Employee
    {
        public int id {  get; set; }
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string? Position { get; set; }
        public string? Place { get; set; }
        public decimal? Salary { get; set; }
        public DateTime HiredOn { get; set; } = DateTime.Now;
        public DateTime? UpdatedOn { get; set; }
    }
}
