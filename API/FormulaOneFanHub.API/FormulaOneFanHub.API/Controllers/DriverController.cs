using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FormulaOneFanHub.API.Controllers;


namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly BlobServiceClient _blobServiceClient;

        public DriverController(FormulaOneFanHubContxt fanHubContxt, BlobServiceClient blobServiceClient)
        {
            _fanHubContext = fanHubContxt;
            _blobServiceClient = blobServiceClient;
        }

        [HttpPost("CreateDriver")]
        public async Task<IActionResult> CreateDriver([FromForm] DriverDto driverDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string imagePath = null;
            if (driverDto.ImageFile != null && driverDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + driverDto.ImageFile.FileName;
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = driverDto.ImageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                imagePath = blobClient.Uri.AbsoluteUri; // Store the blob URI as the image path
            }

            Driver driverToCreate = new Driver
            {
                Name = driverDto.Name,
                Dob = driverDto.Dob,
                TeamIdRef = driverDto.TeamIdRef,
                Description = driverDto.Description,
                ImagePath = imagePath, // Use the blob URI as the image path
                CreatedOn = DateTime.Now,
                UpdatedOn = DateTime.Now
            };

            _fanHubContext.Drivers.Add(driverToCreate);
            await _fanHubContext.SaveChangesAsync();

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
        public async Task<IActionResult> UpdateDriver([FromForm] DriverDto driverDto)
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
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = driverDto.ImageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                existingDriver.ImagePath = blobClient.Uri.AbsoluteUri; // Update the image path to the new blob URI
            }

            existingDriver.UpdatedOn = DateTime.Now;

            await _fanHubContext.SaveChangesAsync();

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
