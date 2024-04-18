using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly BlobServiceClient _blobServiceClient;

        public ProductController(FormulaOneFanHubContxt fanHubContext, BlobServiceClient blobServiceClient)
        {
            _fanHubContext = fanHubContext;
            _blobServiceClient = blobServiceClient;
        }

        [HttpPost("CreateProduct")]
        public IActionResult CreateProduct([FromForm] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (productDto.ImageFile1 == null || productDto.ImageFile2 == null)
            {
                return BadRequest("At least 2 images are required.");
            }

            var imagePaths = new List<string>();

            foreach (var imageFile in new[] { productDto.ImageFile1, productDto.ImageFile2, productDto.ImageFile3, productDto.ImageFile4 })
            {
                if (imageFile != null)
                {
                    var fileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                    var blobContainerName = "web"; // Replace with your actual container name
                    var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
                    var blobClient = blobContainerClient.GetBlobClient(fileName);

                    using (var stream = imageFile.OpenReadStream())
                    {
                        blobClient.Upload(stream, true);
                    }

                    imagePaths.Add(blobClient.Uri.AbsoluteUri);
                }
            }

            // Check if enough images were provided
            if (imagePaths.Count < 2)
            {
                // Clean up created images
                foreach (var path in imagePaths)
                {
                    var fullPath = Path.Combine("wwwroot/images", path);
                    if (System.IO.File.Exists(fullPath))
                    {
                        System.IO.File.Delete(fullPath);
                    }
                }

                return BadRequest("At least 2 images are required.");
            }

            Product productToCreate = new Product
            {
                ProductName = productDto.ProductName,
                Description = productDto.Description,
                Price = productDto.Price,
                TeamId = productDto.TeamId,
                ProductCategoryId = productDto.ProductCategoryId,
                StockQuantity = productDto.StockQuantity,
                ImagePath1 = imagePaths[0],
                ImagePath2 = imagePaths[1],
                ImagePath3 = imagePaths.Count > 2 ? imagePaths[2] : null,
                ImagePath4 = imagePaths.Count > 3 ? imagePaths[3] : null,
                IsActive = productDto.IsActive,
                DiscountAmount = productDto.DiscountAmount,
                UniqueName = $"{Guid.NewGuid()}_{productDto.ProductName}"
            };

            _fanHubContext.Products.Add(productToCreate);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetProducts")]
        public IActionResult GetProducts()
        {
            var products = _fanHubContext.Products;
            return Ok(products);
        }

        [HttpGet("GetProductById")]
        public IActionResult GetProductById(int id)
        {
            var product = _fanHubContext.Products.Find(id);
            return Ok(product);
        }


        [HttpPut("UpdateProduct/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingProduct = _fanHubContext.Products.Find(id);

            if (existingProduct == null)
            {
                return NotFound("Product not found.");
            }

            // Update the product properties
            existingProduct.ProductName = productDto.ProductName;
            existingProduct.Description = productDto.Description;
            existingProduct.Price = productDto.Price;
            existingProduct.TeamId = productDto.TeamId;
            existingProduct.ProductCategoryId = productDto.ProductCategoryId;
            existingProduct.StockQuantity = productDto.StockQuantity;
            existingProduct.IsActive = productDto.IsActive;
            existingProduct.DiscountAmount = productDto.DiscountAmount;
            existingProduct.UniqueName = $"{Guid.NewGuid()}_{productDto.ProductName}";

            // Update images if provided
            if (productDto.ImageFile1 != null)
            {
                existingProduct.ImagePath1 = await UpdateImage(existingProduct, productDto.ImageFile1);
            }

            if (productDto.ImageFile2 != null)
            {
                existingProduct.ImagePath2 = await UpdateImage(existingProduct, productDto.ImageFile2);
            }

            if (productDto.ImageFile3 != null)
            {
                existingProduct.ImagePath3 = await UpdateImage(existingProduct, productDto.ImageFile3);
            }

            if (productDto.ImageFile4 != null)
            {
                existingProduct.ImagePath4 = await UpdateImage(existingProduct, productDto.ImageFile4);
            }

            _fanHubContext.SaveChanges();

            return Ok("Product updated successfully.");
        }

        // Helper method to update image paths
        private async Task<string> UpdateImage(Product product, IFormFile imageFile)
        {
            var fileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
            var blobContainerName = "web"; // Replace with your actual container name
            var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
            var blobClient = blobContainerClient.GetBlobClient(fileName);

            using (var stream = imageFile.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, overwrite: true);
            }

            return blobClient.Uri.AbsoluteUri;
        }

        [HttpGet("GetAllProductsByCategoryId/{categoryId}")]
        public IActionResult GetAllProductsByCategoryId(int categoryId)
        {
            var products = _fanHubContext.Products
                .Where(p => p.ProductCategoryId == categoryId && p.IsActive) // Filter by IsActive value
                .ToList();
            return Ok(products);
        }





        [HttpGet("GetProductsByTeamId/{teamId}")]
        public IActionResult GetProductsByTeamId(int teamId)
        {
            var products = _fanHubContext.Products.Where(p => p.TeamId == teamId).ToList();
            return Ok(products);
        }

        [HttpGet("GetProductByUniqueName")]
        public IActionResult GetProductByUniqueName(string uniqueName)
        {
            var product = _fanHubContext.Products.FirstOrDefault(p => p.UniqueName == uniqueName);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            return Ok(product);
        }


        public class ProductQuantityAndActiveDto
        {
            public int StockQuantity { get; set; }
            public bool IsActive { get; set; }
        }

        [HttpPut("UpdateQuantityAndActive/{id}")]
        public IActionResult UpdateQuantityAndActive(int id, [FromBody] ProductQuantityAndActiveDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingProduct = _fanHubContext.Products.Find(id);

            if (existingProduct == null)
            {
                return NotFound("Product not found.");
            }

            // Update the product properties
            existingProduct.StockQuantity = productDto.StockQuantity;
            existingProduct.IsActive = productDto.IsActive;

            _fanHubContext.SaveChanges();

            return Ok("Stock quantity and isActive status updated successfully.");
        }



    }
}
