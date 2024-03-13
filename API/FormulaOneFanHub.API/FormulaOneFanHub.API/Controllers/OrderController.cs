using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FormulaOneFanHub.API.Entities;
using FormulaOneFanHub.API.Dtos;
using FormulaOneFanHub.API.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace FormulaOneFanHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public OrderController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            var Orders = _fanHubContext.Orders.ToList();
            return Ok(Orders);
        }

        [HttpGet("GetOrdersById/{id}")]
        public IActionResult GetOrder(int id)
        {
            var orderWithItems = _fanHubContext.Orders
                .Include(o => o.OrderedItem) // Include related ordered items
                .FirstOrDefault(p => p.OrderId == id);

            if (orderWithItems == null)
            {
                return NotFound();
            }

            return Ok(orderWithItems);
        }
        [HttpPost("AddNewOrder")]
        public IActionResult CreateProductOrder(OrderDto orderDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                               .Select(e => e.ErrorMessage)
                                               .ToList();

                return BadRequest(errors);
            }

            var order = new Order
            {
                UniqueId = Guid.NewGuid().ToString(),
                OrderDate = DateTime.Now,
                UserId = orderDto.UserId,
                Name = orderDto.Name,
                Email = orderDto.Email,
                PhoneNumber = orderDto.PhoneNumber,
                Address = orderDto.Address,
                OrderStatus = "Ordered",
                ShippingDate = orderDto.ShippingDate,
                PaymentNumberRazor = orderDto.PaymentNumberRazor,
                PaymentStatus = "Payed",
                PaymentDate = orderDto.PaymentDate,
                OrderIdRazor = orderDto.OrderIdRazor,
                OrderTotalAmount = orderDto.OrderTotalAmount,
                OrderedItem = new List<OrderedItem>()
            };

            // Add order to context but don't save changes yet
            _fanHubContext.Orders.Add(order);

            // Save changes to get the OrderId
            _fanHubContext.SaveChanges();

            foreach (var orderedItemDto in orderDto.orderedItemsDto)
            {
                // Retrieve the product details to get the TeamId
                var product = _fanHubContext.Products
                    .Include(p => p.Team)
                    .FirstOrDefault(p => p.ProductId == orderedItemDto.ProductId);

                if (product == null)
                {
                    // Handle the case where the product is not found
                    return BadRequest($"Product with ID {orderedItemDto.ProductId} not found.");
                }

                // Check if the stock quantity is sufficient
                if (product.StockQuantity < orderedItemDto.Quantity)
                {
                    return BadRequest($"Product with ID {orderedItemDto.ProductId} is out of stock.");
                }

                // Use the TeamId from the product
                var teamId = product.TeamId;

                // Reduce the quantity of the product in the Product table
                product.StockQuantity -= orderedItemDto.Quantity;

                var orderedItem = new OrderedItem
                {
                    ProductId = orderedItemDto.ProductId,
                    Quantity = orderedItemDto.Quantity,
                    Price = orderedItemDto.Price,
                    DiscountPrice = orderedItemDto.DiscountPrice,
                    FinalPrice = orderedItemDto.FinalPrice
                };
                order.OrderedItem.Add(orderedItem);

                // Create SoldItem entry for each ordered item
                var soldItem = new SoldItem
                {
                    OrderId = order.OrderId, // Use the obtained OrderId
                    ProductId = orderedItemDto.ProductId,
                    TeamId = teamId,
                    Quantity = orderedItemDto.Quantity,
                    PricePerItem = orderedItemDto.Price,
                    TotalPrice = orderedItemDto.Quantity * orderedItemDto.Price,
                    SoldDate = DateTime.Now,
                    Status = "sold"
                };

                _fanHubContext.SoldItems.Add(soldItem);
            }

            // Save changes to update product quantity, add SoldItems, and complete the order creation
            _fanHubContext.SaveChanges();

            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, order);
        }






        [HttpGet("GetOrdersByUserId/{userId}")]
        public IActionResult GetOrdersByUserId(string userId)
        {
            var ordersWithItems = _fanHubContext.Orders
                .Include(o => o.OrderedItem) // Include related ordered items
                .Where(o => o.UserId == userId)
                .ToList();

            if (ordersWithItems.Count == 0)
            {
                return NotFound("No orders found for the specified user.");
            }

            return Ok(ordersWithItems);
        }


        [HttpGet("HelloWorld/{id}")]
        public IActionResult HelloWorld(int id)
        {
            // Retrieve the order with its items
            var orderWithItems = _fanHubContext.Orders
                .Include(o => o.OrderedItem)
                .FirstOrDefault(o => o.OrderId == id);

            if (orderWithItems == null)
            {
                return NotFound();
            }

            // You can add more data here from the Order table if needed
            var orderData = new
            {
                orderWithItems.OrderId,
                orderWithItems.UniqueId,
                orderWithItems.OrderDate,
                orderWithItems.UserId,
                orderWithItems.Name,
                orderWithItems.Email,
                orderWithItems.PhoneNumber,
                orderWithItems.Address,
                orderWithItems.OrderStatus,
                orderWithItems.ShippingDate,
                orderWithItems.PaymentNumberRazor,
                orderWithItems.PaymentStatus,
                orderWithItems.PaymentDate,
                orderWithItems.OrderIdRazor,
                orderWithItems.OrderTotalAmount,
                orderItems = orderWithItems.OrderedItem.Select(oi => new
                {
                    oi.OrderedItemId,
                    oi.ProductId,
                    oi.Quantity,
                    oi.Price,
                    oi.DiscountPrice,
                    oi.FinalPrice,
                    ProductName = _fanHubContext.Products
                        .Where(p => p.ProductId == oi.ProductId)
                        .Select(p => p.ProductName)
                        .FirstOrDefault(),
                    ProductImagePath = _fanHubContext.Products
                        .Where(p => p.ProductId == oi.ProductId)
                        .Select(p => p.ImagePath1)
                        .FirstOrDefault(),
                    UniqueName = _fanHubContext.Products
                        .Where(p => p.ProductId == oi.ProductId)
                        .Select(p => p.UniqueName)
                        .FirstOrDefault()
                })
            };

            return Ok(orderData);
        }



    }
}
