using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public ProductController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
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
                    var filePath = Path.Combine("wwwroot/images", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        imageFile.CopyTo(stream);
                    }

                    imagePaths.Add(fileName);
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
        public IActionResult UpdateProduct(int id, [FromForm] ProductDto productDto)
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
            existingProduct.UniqueName = $"{Guid.NewGuid()}_{productDto.ProductName}";

            // Update images if provided
            if (productDto.ImageFile1 != null)
            {
                UpdateImage(existingProduct, productDto.ImageFile1, 1);
            }

            if (productDto.ImageFile2 != null)
            {
                UpdateImage(existingProduct, productDto.ImageFile2, 2);
            }

            if (productDto.ImageFile3 != null)
            {
                UpdateImage(existingProduct, productDto.ImageFile3, 3);
            }

            if (productDto.ImageFile4 != null)
            {
                UpdateImage(existingProduct, productDto.ImageFile4, 4);
            }

            _fanHubContext.SaveChanges();

            return Ok("Product updated successfully.");
        }

        // Helper method to update image paths
        private void UpdateImage(Product product, IFormFile imageFile, int imageNumber)
        {
            var fileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
            var filePath = Path.Combine("wwwroot/images", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                imageFile.CopyTo(stream);
            }

            // Update the corresponding image path property
            switch (imageNumber)
            {
                case 1:
                    product.ImagePath1 = fileName;
                    break;
                case 2:
                    product.ImagePath2 = fileName;
                    break;
                case 3:
                    product.ImagePath3 = fileName;
                    break;
                case 4:
                    product.ImagePath4 = fileName;
                    break;
                default:
                    break;
            }
        }

        [HttpGet("GetAllProductsByCategoryId/{categoryId}")]
        public IActionResult GetAllProductsByCategoryId(int categoryId)
        {
            var products = _fanHubContext.Products.Where(p => p.ProductCategoryId == categoryId).ToList();
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



    }
}
