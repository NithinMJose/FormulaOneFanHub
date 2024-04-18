using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductCategoryController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly BlobServiceClient _blobServiceClient;

        public ProductCategoryController(FormulaOneFanHubContxt fanHubContext, BlobServiceClient blobServiceClient)
        {
            _fanHubContext = fanHubContext;
            _blobServiceClient = blobServiceClient;
        }

        [HttpPost("CreateProductCategory")]
        public async Task<IActionResult> CreateProductCategory([FromForm] ProductCategoryDto productCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string imagePath = null;

            if (productCategoryDto.ImageFile != null && productCategoryDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + productCategoryDto.ImageFile.FileName;
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = productCategoryDto.ImageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                imagePath = blobClient.Uri.AbsoluteUri; // Store the blob URI as the image path
            }

            ProductCategory productCategoryToCreate = new ProductCategory
            {
                PCategoryName = productCategoryDto.PCategoryName,
                ImagePath = imagePath, // Use the blob URI as the image path
                CreatedOn = DateTime.Now,
                UpdatedOn = DateTime.Now,
                UniqueName = $"{Guid.NewGuid()}_{productCategoryDto.PCategoryName}"
            };

            _fanHubContext.ProductCategories.Add(productCategoryToCreate);
            await _fanHubContext.SaveChangesAsync();

            return StatusCode(201);
        }

        [HttpGet("GetProductCategories")]
        public IActionResult GetProductCategories()
        {
            var productCategories = _fanHubContext.ProductCategories;
            return Ok(productCategories);
        }

        [HttpGet("GetProductCategoryById")]
        public IActionResult GetProductCategoryById(int id)
        {
            var productCategory = _fanHubContext.ProductCategories.Find(id);
            return Ok(productCategory);
        }

        [HttpPut("UpdateProductCategory")]
        public async Task<IActionResult> UpdateProductCategory(int id, [FromForm] ProductCategoryDto productCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingProductCategory = _fanHubContext.ProductCategories.Find(id);

            if (existingProductCategory == null)
            {
                return NotFound();
            }

            existingProductCategory.PCategoryName = productCategoryDto.PCategoryName;

            if (productCategoryDto.ImageFile != null && productCategoryDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + productCategoryDto.ImageFile.FileName;
                var blobContainerName = "web"; // Replace with your actual container name
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                var blobClient = blobContainerClient.GetBlobClient(fileName);

                using (var stream = productCategoryDto.ImageFile.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                existingProductCategory.ImagePath = blobClient.Uri.AbsoluteUri; // Update the image path to the new blob URI
            }

            existingProductCategory.UpdatedOn = DateTime.Now;
            existingProductCategory.UniqueName = $"{Guid.NewGuid()}_{productCategoryDto.PCategoryName}";

            await _fanHubContext.SaveChangesAsync();

            return Ok();
        }


        [HttpGet("GetAllProductCategories")]
        public IActionResult GetAllProductCategories()
        {
            var categories = _fanHubContext.ProductCategories
                                            .Select(pc => new { Id = pc.ProductCategoryId, Name = pc.PCategoryName })
                                            .ToList();
            return Ok(categories);
        }

        [HttpGet("GetProductCategoryIdByUniqueName")]
        public IActionResult GetProductCategoryIdByUniqueName(string uniqueName)
        {
            var productCategory = _fanHubContext.ProductCategories.FirstOrDefault(pc => pc.UniqueName == uniqueName);

            if (productCategory == null)
            {
                return NotFound("Product category not found with the provided unique name.");
            }

            return Ok(productCategory.ProductCategoryId);
        }



    }
}
