using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketCategoryController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly BlobServiceClient _blobServiceClient;

        public TicketCategoryController(FormulaOneFanHubContxt fanHubContext, BlobServiceClient blobServiceClient)
        {
            _fanHubContext = fanHubContext;
            _blobServiceClient = blobServiceClient;
        }

        [HttpPost("InsertTicketCategory")]
        public async Task<IActionResult> InsertTicketCategory([FromForm] TicketCategoryDto ticketCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (ticketCategoryDto.ImageFile != null && ticketCategoryDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + ticketCategoryDto.ImageFile.FileName;
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = ticketCategoryDto.ImageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                // Set the ImagePath here
                ticketCategoryDto.ImagePath = blobClient.Uri.AbsoluteUri;
            }

            var ticketCategoryToCreate = new TicketCategory
            {
                CategoryName = ticketCategoryDto.CategoryName,
                Description = ticketCategoryDto.Description,
                TicketPrice = ticketCategoryDto.TicketPrice,
                ImagePath = ticketCategoryDto.ImagePath, // Set the ImagePath property
            };

            _fanHubContext.TicketCategories.Add(ticketCategoryToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpPut("UpdateTicketCategory")]
        public async Task<IActionResult> UpdateTicketCategory([FromForm] TicketCategoryDto ticketCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTicketCategory = _fanHubContext.TicketCategories.Find(ticketCategoryDto.TicketCategoryId);

            if (existingTicketCategory == null)
            {
                return NotFound();
            }

            if (ticketCategoryDto.ImageFile != null && ticketCategoryDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + ticketCategoryDto.ImageFile.FileName;
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = ticketCategoryDto.ImageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                existingTicketCategory.ImagePath = blobClient.Uri.AbsoluteUri;
            }

            existingTicketCategory.CategoryName = ticketCategoryDto.CategoryName;
            existingTicketCategory.Description = ticketCategoryDto.Description;
            existingTicketCategory.TicketPrice = ticketCategoryDto.TicketPrice;

            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetAllTicketCategories")]
        public IActionResult GetAllTicketCategories()
        {
            var ticketCategories = _fanHubContext.TicketCategories;
            return Ok(ticketCategories);
        }

        [HttpGet("GetTicketCategoryById")]
        public IActionResult GetTicketCategoryById(int id)
        {
            var ticketCategory = _fanHubContext.TicketCategories.Find(id);

            if (ticketCategory == null)
            {
                return NotFound();
            }

            return Ok(ticketCategory);
        }


        [HttpDelete("DeleteTicketCategory")]
        public IActionResult DeleteTicketCategory(int id)
        {
            var ticketCategoryToDelete = _fanHubContext.TicketCategories.Find(id);

            if (ticketCategoryToDelete == null)
            {
                return NotFound();
            }

            _fanHubContext.TicketCategories.Remove(ticketCategoryToDelete);
            _fanHubContext.SaveChanges();

            return Ok();
        }
    }
}
