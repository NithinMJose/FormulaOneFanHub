using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public EmployeeController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("CreateEmployee")]
        public IActionResult CreateEmployee([FromBody] EmployeeAddDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the provided EmployeeId is unique
            if (_fanHubContext.Employees.Any(e => e.EmployeeId == employeeDto.EmployeeId))
            {
                ModelState.AddModelError("EmployeeId", "EmployeeId must be unique.");
                return BadRequest(ModelState);
            }

            Employee employeeToCreate = new Employee
            {
                EmployeeId = employeeDto.EmployeeId,
                EmployeeName = employeeDto.EmployeeName,
                HiredOn = DateTime.Now
            };

            _fanHubContext.Employees.Add(employeeToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetEmployees")]
        public IActionResult GetEmployees()
        {
            var employees = _fanHubContext.Employees;
            return Ok(employees);
        }

        [HttpGet("GetEmployeeById")]
        public IActionResult GetEmployeeById(int id)
        {
            var employee = _fanHubContext.Employees.Find(id);
            return Ok(employee);
        }

        [HttpPut("UpdateEmployee")]
        public IActionResult UpdateEmployee([FromBody] EmployeeUpdateDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingEmployee = _fanHubContext.Employees.FirstOrDefault(e => e.EmployeeId == employeeDto.EmployeeId);

            if (existingEmployee == null)
            {
                return NotFound();
            }

            existingEmployee.EmployeeName = employeeDto.EmployeeName ?? existingEmployee.EmployeeName;
            existingEmployee.Position = employeeDto.Position ?? existingEmployee.Position;
            existingEmployee.Place = employeeDto.Place ?? existingEmployee.Place;
            existingEmployee.Salary = employeeDto.Salary ?? existingEmployee.Salary;
            existingEmployee.UpdatedOn = DateTime.Now;

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetAllEmployeeIds")]
        public IActionResult GetAllEmployeeIds()
        {
            // Fetch all employee IDs from the database
            var employeeIds = _fanHubContext.Employees.Select(e => e.EmployeeId).ToList();

            return Ok(employeeIds);
        }
    }

    public class EmployeeAddDto
    {
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
    }

    public class EmployeeUpdateDto
    {
        public string EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? Position { get; set; }
        public string? Place { get; set; }
        public decimal? Salary { get; set; }
    }
}
