﻿using Microsoft.AspNetCore.Mvc;
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
            var order = _fanHubContext.Orders.FirstOrDefault(p => p.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
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



        [HttpDelete("DeleteOrder/{id}")]
        public IActionResult DeleteOrder(int id)
        {
            var existingOrder = _fanHubContext.Orders.FirstOrDefault(p => p.OrderId == id);
            if (existingOrder == null)
            {
                return NotFound();
            }

            _fanHubContext.Orders.Remove(existingOrder);
            _fanHubContext.SaveChanges();

            return NoContent();
        }
    }
}