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

            foreach (var orderedItemDto in orderDto.orderedItemsDto)
            {
                var orderedItem = new OrderedItem
                {
                    ProductId = orderedItemDto.ProductId,
                    Quantity = orderedItemDto.Quantity,
                    Price = orderedItemDto.Price,
                    DiscountPrice = orderedItemDto.DiscountPrice,
                    FinalPrice = orderedItemDto.FinalPrice
                };
                order.OrderedItem.Add(orderedItem);
            }

            _fanHubContext.Orders.Add(order);
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
                        .FirstOrDefault()
                })
            };

            return Ok(orderData);
        }



    }
}
