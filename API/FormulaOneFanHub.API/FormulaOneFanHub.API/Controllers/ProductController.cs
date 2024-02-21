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

            if (productDto.ImageFile1 == null)
            {
                return BadRequest("Image 1 is required.");
            }

            var imageCount = new[] { productDto.ImageFile1, productDto.ImageFile2, productDto.ImageFile3, productDto.ImageFile4 }
                .Count(file => file != null);

            if (imageCount < 2)
            {
                return BadRequest("At least 2 images are required.");
            }

            var imagePaths = new string[4];
            var index = 0;

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

                    imagePaths[index++] = fileName;
                }
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
                ImagePath3 = imagePaths[2],
                ImagePath4 = imagePaths[3],
                IsActive = productDto.IsActive
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




    }
}
