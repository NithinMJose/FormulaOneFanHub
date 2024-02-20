using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductCategoryController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public ProductCategoryController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpPost("CreateProductCategory")]
        public IActionResult CreateProductCategory([FromForm] ProductCategoryDto productCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string imagePath = null;

            if (productCategoryDto.ImageFile != null && productCategoryDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + productCategoryDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    productCategoryDto.ImageFile.CopyTo(stream);
                }

                // Set the ImagePath here
                imagePath = fileName;
            }

            ProductCategory productCategoryToCreate = new ProductCategory
            {
                PCategoryName = productCategoryDto.PCategoryName,
                ImagePath = imagePath, // Set the ImagePath property
                CreatedOn = DateTime.Now,
                UpdatedOn = DateTime.Now
            };

            _fanHubContext.ProductCategories.Add(productCategoryToCreate);
            _fanHubContext.SaveChanges();

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
        public IActionResult UpdateProductCategory(int id, [FromForm] ProductCategoryDto productCategoryDto)
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
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    productCategoryDto.ImageFile.CopyTo(stream);
                }

                existingProductCategory.ImagePath = fileName;
            }

            existingProductCategory.UpdatedOn = DateTime.Now;

            _fanHubContext.SaveChanges();

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


    }
}
