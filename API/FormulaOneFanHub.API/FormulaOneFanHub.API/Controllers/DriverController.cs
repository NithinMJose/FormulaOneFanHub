﻿using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public DriverController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("CreateDriver")]
        public IActionResult CreateDriver([FromForm] DriverDto driverDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (driverDto.ImageFile != null && driverDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + driverDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    driverDto.ImageFile.CopyTo(stream);
                }

                // Set the ImagePath here
                driverDto.ImagePath = fileName;
            }

            Driver driverToCreate = new Driver
            {
                Name = driverDto.Name,
                Dob = driverDto.Dob,
                TeamIdRef = driverDto.TeamIdRef,
                Description = driverDto.Description,
                ImagePath = driverDto.ImagePath, // Set the ImagePath property
                CreatedOn = DateTime.Now,
                UpdatedOn = DateTime.Now
            };

            _fanHubContext.Drivers.Add(driverToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }



        [HttpGet("GetDrivers")]
        public IActionResult GetDrivers()
        {
            var drivers = _fanHubContext.Drivers;
            return Ok(drivers);
        }

        [HttpGet("GetDriverById")]
        public IActionResult GetDriverById(int id)
        {
            var driver = _fanHubContext.Drivers.Find(id);
            return Ok(driver);
        }

        [HttpPut("UpdateDriver")]
        public IActionResult UpdateDriver([FromForm] DriverDto driverDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingDriver = _fanHubContext.Drivers.Find(driverDto.Id);

            if (existingDriver == null)
            {
                return NotFound();
            }

            existingDriver.Name = driverDto.Name;
            existingDriver.Dob = driverDto.Dob;
            existingDriver.Description = driverDto.Description;

            if (driverDto.ImageFile != null && driverDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + driverDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    driverDto.ImageFile.CopyTo(stream);
                }

                existingDriver.ImagePath = fileName;
            }

            existingDriver.UpdatedOn = DateTime.Now;

            _fanHubContext.SaveChanges();

            return Ok();
        }



        [HttpPost("CheckDriver")]
        public IActionResult CheckDriver([FromBody] CheckDriverInput checkDriverInput)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the driver with the given name and dob already exists
            var isDriverExists = _fanHubContext.Drivers
                .Any(d => EF.Functions.Like(d.Name, checkDriverInput.Name) && d.Dob == checkDriverInput.Dob);

            var response = new { IsDriverExists = isDriverExists };

            return Ok(response);
        }


    }

    public class CheckDriverInput
    {
        public string Name { get; set; }
        public DateTime Dob { get; set; }
    }
}
