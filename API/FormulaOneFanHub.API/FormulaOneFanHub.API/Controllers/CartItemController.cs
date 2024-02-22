using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public CartItemController(FormulaOneFanHubContxt fanHubContxt)
        {
            _fanHubContext = fanHubContxt;
        }

        [HttpPost("AddToCart")]
        public IActionResult AddToCart([FromBody] CartItemDto cartItemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the product exists
            var product = _fanHubContext.Products.Find(cartItemDto.ProductId);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Generate CartItemId automatically
            int lastCartItemId = _fanHubContext.CartItems.Any() ? _fanHubContext.CartItems.Max(c => c.CartItemId) : 0;
            int newCartItemId = lastCartItemId + 1;

            // Create a new cart item
            var cartItem = new CartItem
            {
                ProductId = cartItemDto.ProductId,
                UserId = cartItemDto.UserId,
                Quantity = cartItemDto.Quantity,
                Price = cartItemDto.Price,
                Timestamp = DateTime.Now,
                Status = "active", // Set default status to active
                Size = cartItemDto.Size
            };

            // Add the cart item to the database
            _fanHubContext.CartItems.Add(cartItem);
            _fanHubContext.SaveChanges();

            return StatusCode(201);
        }

        [HttpGet("GetCartItemsByUserId/{userId}")]
        public IActionResult GetCartItemsByUserId(int userId)
        {
            var cartItems = _fanHubContext.CartItems.Where(c => c.UserId == userId).ToList();
            return Ok(cartItems);
        }

        [HttpPut("UpdateCartItemStatus/{cartItemId}")]
        public IActionResult UpdateCartItemStatus(int cartItemId, [FromBody] string status)
        {
            var cartItem = _fanHubContext.CartItems.Find(cartItemId);
            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            cartItem.Status = status;
            _fanHubContext.SaveChanges();

            return Ok("Cart item status updated successfully.");
        }

        [HttpDelete("RemoveFromCart/{cartItemId}")]
        public IActionResult RemoveFromCart(int cartItemId)
        {
            var cartItem = _fanHubContext.CartItems.Find(cartItemId);
            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            _fanHubContext.CartItems.Remove(cartItem);
            _fanHubContext.SaveChanges();

            return Ok("Cart item removed successfully.");
        }
    }
}
