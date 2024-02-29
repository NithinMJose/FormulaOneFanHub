using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public WishlistController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("AddToWishlist")]
        public IActionResult AddToWishlist([FromBody] WishListDto wishlistItemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the product exists
            var product = _fanHubContext.Products.Find(wishlistItemDto.ProductId);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Check if the product already exists in the user's wishlist
            var existingWishlistItem = _fanHubContext.WishLists.FirstOrDefault(w => w.UserId == wishlistItemDto.UserId && w.ProductId == wishlistItemDto.ProductId);

            if (existingWishlistItem != null)
            {
                return Conflict("Product already exists in the wishlist.");
            }

            // Create a new wishlist item
            var wishlistItem = new WishList
            {
                ProductId = wishlistItemDto.ProductId,
                UserId = wishlistItemDto.UserId
            };

            // Add the wishlist item to the database
            _fanHubContext.WishLists.Add(wishlistItem);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpPost("RemoveFromWishlist")]
        public IActionResult RemoveFromWishlist([FromBody] WishListDto wishlistItemDto)
        {
            var wishlistItem = _fanHubContext.WishLists.FirstOrDefault(w => w.UserId == wishlistItemDto.UserId && w.ProductId == wishlistItemDto.ProductId);
            if (wishlistItem == null)
            {
                return NotFound("Wishlist item not found.");
            }

            _fanHubContext.WishLists.Remove(wishlistItem);
            _fanHubContext.SaveChanges();

            return Ok("Wishlist item removed successfully.");
        }

        [HttpPost("GetWishlistByUserId")]
        public IActionResult GetWishlistByUserId([FromBody] UserIdDto userIdDto)
        {
            var wishlistItems = _fanHubContext.WishLists.Where(w => w.UserId == userIdDto.UserId).ToList();
            return Ok(wishlistItems);
        }

        public class UserIdDto
        {
            [Required(ErrorMessage = "User ID is required")]
            public int UserId { get; set; }
        }
    }
}
