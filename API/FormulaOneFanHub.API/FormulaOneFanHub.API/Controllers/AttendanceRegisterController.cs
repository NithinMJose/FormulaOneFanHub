using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceRegisterController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public AttendanceRegisterController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("EmployeeEntry")]
        public IActionResult EmployeeEntry([FromBody] string employeeId)
        {
            // Check if employeeId exists
            var employee = _fanHubContext.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);
            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            // Check if the employee is already clocked in
            var existingEntry = _fanHubContext.AttendanceRegisters.FirstOrDefault(r => r.EmployeeId == employeeId && r.OutTime == null);
            if (existingEntry != null)
            {
                return BadRequest("Employee is already clocked in");
            }

            // Create a new entry
            var newEntry = new AttendanceRegister
            {
                EmployeeId = employeeId,
                InTime = DateTime.Now
            };

            _fanHubContext.AttendanceRegisters.Add(newEntry);
            _fanHubContext.SaveChanges();

            return Ok("Employee clocked in successfully");
        }

        [HttpPost("EmployeeLeave")]
        public IActionResult EmployerLeave([FromBody] string employeeId)
        {
            // Check if employeeId exists
            var employee = _fanHubContext.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);
            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            // Check if the employee is already clocked out
            var existingEntry = _fanHubContext.AttendanceRegisters.FirstOrDefault(r => r.EmployeeId == employeeId && r.OutTime == null);
            if (existingEntry == null)
            {
                return BadRequest("Employee is not currently clocked in");
            }

            // Update the existing entry with OutTime
            existingEntry.OutTime = DateTime.Now;

            // Calculate the work time
            existingEntry.WorkTime = existingEntry.OutTime - existingEntry.InTime;

            _fanHubContext.SaveChanges();

            return Ok("Employee clocked out successfully");
        }

        [HttpGet("getTotalTimeByEmployerId")]
        public IActionResult GetTotalTimeByEmployerId(string employeeId)
        {
            // Fetch all entries for the given employeeId
            var entries = _fanHubContext.AttendanceRegisters.Where(r => r.EmployeeId == employeeId && r.WorkTime != null).ToList();

            // Calculate total work time
            TimeSpan totalWorkTime = new TimeSpan();
            foreach (var entry in entries)
            {
                totalWorkTime += entry.WorkTime.Value;
            }

            return Ok(totalWorkTime.ToString(@"hh\:mm\:ss"));
        }

        [HttpGet("GetActiveEmployees")]
        public IActionResult GetActiveEmployees()
        {
            // Find all entries where OutTime is null, indicating employees who have checked in but not checked out
            var activeEmployeeIds = _fanHubContext.AttendanceRegisters
                .Where(r => r.OutTime == null)
                .Select(r => r.EmployeeId)
                .Distinct()
                .ToList();

            // Query the Employees table to get details of active employees
            var activeEmployees = _fanHubContext.Employees
                .Where(e => activeEmployeeIds.Contains(e.EmployeeId))
                .ToList();

            // Get the last in time for each active employee
            var activeEmployeesWithLastInTime = activeEmployees
                .Select(emp => new
                {
                    Employee = emp,
                    LastInTime = _fanHubContext.AttendanceRegisters
                        .Where(r => r.EmployeeId == emp.EmployeeId && r.OutTime == null)
                        .Max(r => r.InTime)
                })
                .ToList();

            // Combine the active employees with their last in time
            var result = activeEmployeesWithLastInTime
                .Select(item => new
                {
                    item.Employee.EmployeeId,
                    item.Employee.EmployeeName,
                    item.LastInTime,
                    item.Employee.Position,
                    item.Employee.Place,
                    item.Employee.Salary,
                    item.Employee.HiredOn,
                    item.Employee.UpdatedOn
                })
                .ToList();

            return Ok(result);
        }



        [HttpGet("GetEmployees")]
        public IActionResult GetEmployees()
        {
            var employees = _fanHubContext.Employees.ToList();

            var employeesWithWorkTime = employees.Select(e => new
            {
                Employee = e,
                AttendanceRegisters = _fanHubContext.AttendanceRegisters
                    .Where(r => r.EmployeeId == e.EmployeeId && r.WorkTime != null)
                    .Select(r => r.WorkTime.Value)
                    .ToList() // Materialize the query
            })
            .ToList();

            // Calculate total work time for each employee in memory
            var response = employeesWithWorkTime.Select(item => new
            {
                Employee = item.Employee,
                TotalWorkTime = item.AttendanceRegisters.Any() ?
                    item.AttendanceRegisters.Aggregate(TimeSpan.Zero, (acc, cur) => acc + cur) :
                    TimeSpan.Zero // Handle empty work time
            })
            .ToList()
            .Select(item => new
            {
                item.Employee,
                TotalWorkTime = item.TotalWorkTime.ToString(@"hh\:mm\:ss")
            });

            return Ok(response);
        }



    }
}
