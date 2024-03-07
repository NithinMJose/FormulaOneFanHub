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
                return BadRequest(ModelState);
            }

            var order = new Order
            {
                UniqueId = orderDto.UniqueId,
                OrderDate = orderDto.OrderDate,
                UserId = orderDto.UserId,
                Name = orderDto.Name,
                Email = orderDto.Email,
                PhoneNumber = orderDto.PhoneNumber,
                Address = orderDto.Address,
                OrderStatus = orderDto.OrderStatus,
                ShippedDate = orderDto.ShippedDate,
                PaymentNumberRazor = orderDto.PaymentNumberRazor,
                PaymentStatus = orderDto.PaymentStatus,
                PaymentDate = orderDto.PaymentDate,
                OrderIdRazor = orderDto.OrderIdRazor,
                DiscountTotal = orderDto.DiscountTotal,
                OrderTotalAmount = orderDto.OrderTotalAmount
            };

            _fanHubContext.Orders.Add(order);
            _fanHubContext.SaveChanges();

            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, order);
        }

        [HttpPut("EditOrder/{id}")]
        public IActionResult UpdateProductOrder(int id, OrderDto orderDto)
        {
            var existingOrder = _fanHubContext.Orders.FirstOrDefault(p => p.OrderId == id);
            if (existingOrder == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            existingOrder.UniqueId = orderDto.UniqueId;
            existingOrder.OrderDate = orderDto.OrderDate;
            existingOrder.UserId = orderDto.UserId;
            existingOrder.Name = orderDto.Name;
            existingOrder.Email = orderDto.Email;
            existingOrder.PhoneNumber = orderDto.PhoneNumber;
            existingOrder.Address = orderDto.Address;
            existingOrder.OrderStatus = orderDto.OrderStatus;
            existingOrder.ShippedDate = orderDto.ShippedDate;
            existingOrder.PaymentNumberRazor = orderDto.PaymentNumberRazor;
            existingOrder.PaymentStatus = orderDto.PaymentStatus;
            existingOrder.PaymentDate = orderDto.PaymentDate;
            existingOrder.OrderIdRazor = orderDto.OrderIdRazor;
            existingOrder.DiscountTotal = orderDto.DiscountTotal;
            existingOrder.OrderTotalAmount = orderDto.OrderTotalAmount;

            _fanHubContext.SaveChanges();

            return NoContent();
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
