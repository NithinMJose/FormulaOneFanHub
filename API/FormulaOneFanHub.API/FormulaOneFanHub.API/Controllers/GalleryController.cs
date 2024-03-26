using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public GalleryController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("UploadImage")]
        public IActionResult UploadImage([FromForm] GalleryDto galleryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (galleryDto.ImageFile != null && galleryDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + galleryDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    galleryDto.ImageFile.CopyTo(stream);
                }

                Gallery galleryToCreate = new Gallery
                {
                    ImageUrl = fileName,
                    Caption = galleryDto.Caption,
                    // Generate a unique name for the image wgich will be GUID_ImageUrl
                    UniqueName = Guid.NewGuid().ToString() +"_"+fileName,
                    IsActive = "Yes"
                };

                _fanHubContext.Galleries.Add(galleryToCreate);
                _fanHubContext.SaveChanges();

                return StatusCode(201);
            }

            return BadRequest("Image file is required.");
        }

        [HttpGet("GetAllImages")]
        public IActionResult GetAllImages()
        {
            var images = _fanHubContext.Galleries.ToList();
            return Ok(images);
        }

        [HttpGet("GetImageById")]
        public IActionResult GetImageById(int id)
        {
            var image = _fanHubContext.Galleries.Find(id);

            if (image == null)
            {
                return NotFound();
            }

            return Ok(image);
        }


        [HttpPut("UpdateImage")]
        public IActionResult UpdateImage(string uniqueName, [FromForm] GalleryDto galleryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingImage = _fanHubContext.Galleries.FirstOrDefault(g => g.UniqueName == uniqueName);

            if (existingImage == null)
            {
                return NotFound();
            }

            existingImage.Caption = galleryDto.Caption;

            if (galleryDto.ImageFile != null && galleryDto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + galleryDto.ImageFile.FileName;
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    galleryDto.ImageFile.CopyTo(stream);
                }

                existingImage.ImageUrl = fileName;
            }

            _fanHubContext.SaveChanges();

            return Ok();
        }



        [HttpDelete("DeleteImage")]
        public IActionResult DeleteImage(string uniqueName)
        {
            var image = _fanHubContext.Galleries.FirstOrDefault(g => g.UniqueName == uniqueName);

            if (image == null)
            {
                return NotFound();
            }

            image.IsActive = "No";
            _fanHubContext.SaveChanges();

            return Ok();
        }

        [HttpGet("GetGalleryByUniqueName")]
        public IActionResult GetGalleryByUniqueName(string uniqueName)
        {
            var gallery = _fanHubContext.Galleries.FirstOrDefault(g => g.UniqueName == uniqueName);

            if (gallery == null)
            {
                return NotFound();
            }

            return Ok(gallery);
        }



    }
}
