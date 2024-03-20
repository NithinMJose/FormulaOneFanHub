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
                DeliveryCompanyId =7,
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


        [HttpGet("GetFullOrdersByUserId/{userId}")]
        public IActionResult GetFullOrdersByUserId(string userId)
        {
            var ordersWithItems = _fanHubContext.Orders
                .Include(o => o.OrderedItem) // Include related ordered items
                .Where(o => o.UserId == userId)
                .ToList();

            if (ordersWithItems.Count == 0)
            {
                return NotFound("No orders found for the specified user.");
            }

            var fullOrders = ordersWithItems.Select(order =>
            {
                var orderData = new
                {
                    order.OrderId,
                    order.UniqueId,
                    order.OrderDate,
                    order.UserId,
                    order.Name,
                    order.Email,
                    order.PhoneNumber,
                    order.Address,
                    order.OrderStatus,
                    order.ShippingDate,
                    order.PaymentNumberRazor,
                    order.PaymentStatus,
                    order.PaymentDate,
                    order.OrderIdRazor,
                    order.OrderTotalAmount,
                    orderItems = order.OrderedItem.Select(oi => new
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
                            .FirstOrDefault(),
                        TeamName = _fanHubContext.Products
                        .Where(p => p.ProductId == oi.ProductId)
                            .Select(p => p.Team.Name)
                            .FirstOrDefault()
                    })
                };
                return orderData;
            });

            return Ok(fullOrders);
        }

        [HttpGet("GetOrderByUniqueName/{uniqueName}")]
        public IActionResult GetOrderByUniqueName(string uniqueName)
        {
            var orderWithItems = _fanHubContext.Orders
                .Include(o => o.OrderedItem) // Include related ordered items
                .FirstOrDefault(o => o.UniqueId == uniqueName);

            if (orderWithItems == null)
            {
                return NotFound($"Order with unique name '{uniqueName}' not found.");
            }

            var responseData = new
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
                        .FirstOrDefault(),
                    TeamName = _fanHubContext.Products
                        .Where(p => p.ProductId == oi.ProductId)
                        .Select(p => p.Team.Name)
                        .FirstOrDefault()
                })
            };

            return Ok(responseData);
        }
        [HttpGet("GetOrderDetailsForDeliveryCompany/{deliveryCompanyId}")]
        public IActionResult GetOrderDetailsForDeliveryCompany(int deliveryCompanyId)
        {
            var orderDetails = _fanHubContext.Orders
                .Where(o => o.DeliveryCompanyId == deliveryCompanyId && o.OrderStatus == "Ordered") // Added condition for OrderStatus
                .Select(o => new
                {
                    o.OrderId,
                    o.UniqueId,
                    o.OrderDate,
                    o.UserId,
                    o.Name,
                    o.Email,
                    o.PhoneNumber,
                    o.Address,
                    o.OrderStatus,
                    o.ShippingDate,
                    o.PaymentNumberRazor,
                    o.PaymentStatus,
                    o.PaymentDate,
                    o.OrderIdRazor,
                    o.OrderTotalAmount,
                    DeliveryCompanyId = o.DeliveryCompanyId,
                    OrderItems = o.OrderedItem.Select(oi => new
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
                            .FirstOrDefault(),
                        TeamName = _fanHubContext.Products
                            .Where(p => p.ProductId == oi.ProductId)
                            .Select(p => p.Team.Name)
                            .FirstOrDefault()
                    }).ToList()
                })
                .ToList();

            if (!orderDetails.Any())
            {
                return NotFound($"No 'Ordered' status orders found for the delivery company ID '{deliveryCompanyId}'.");
            }

            return Ok(orderDetails);
        }


        [HttpPut("UpdateOrderStatusToInShipping/{orderId}")]
        public IActionResult UpdateOrderStatusToInShipping(int orderId)
        {
            var order = _fanHubContext.Orders.FirstOrDefault(o => o.OrderId == orderId);
            if (order == null)
            {
                return NotFound($"Order with ID {orderId} not found.");
            }
            order.OrderStatus = "InShipping";
            _fanHubContext.SaveChanges();
            return Ok($"Order with ID {orderId} status updated to 'InShipping'.");
        }


        [HttpGet("GetShippingOrderDetailsForDeliveryCompany/{deliveryCompanyId}")]
        public IActionResult GetShippingOrderDetailsForDeliveryCompany(int deliveryCompanyId)
        {
            var orderDetails = _fanHubContext.Orders
                .Where(o => o.DeliveryCompanyId == deliveryCompanyId && o.OrderStatus == "InShipping") 
                .Select(o => new
                {
                    o.OrderId,
                    o.UniqueId,
                    o.OrderDate,
                    o.UserId,
                    o.Name,
                    o.Email,
                    o.PhoneNumber,
                    o.Address,
                    o.OrderStatus,
                    o.ShippingDate,
                    o.PaymentNumberRazor,
                    o.PaymentStatus,
                    o.PaymentDate,
                    o.OrderIdRazor,
                    o.OrderTotalAmount,
                    DeliveryCompanyId = o.DeliveryCompanyId,
                    OrderItems = o.OrderedItem.Select(oi => new
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
                            .FirstOrDefault(),
                        TeamName = _fanHubContext.Products
                            .Where(p => p.ProductId == oi.ProductId)
                            .Select(p => p.Team.Name)
                            .FirstOrDefault()
                    }).ToList()
                })
                .ToList();

            if (!orderDetails.Any())
            {
                return NotFound($"No 'Ordered' status orders found for the delivery company ID '{deliveryCompanyId}'.");
            }

            return Ok(orderDetails);
        }

        [HttpPut("UpdateOrderStatusToDelivered/{orderId}")]
        public IActionResult UpdateOrderStatusToDelivered(int orderId)
        {
            var order = _fanHubContext.Orders.FirstOrDefault(o => o.OrderId == orderId);
            if (order == null)
            {
                return NotFound($"Order with ID {orderId} not found.");
            }
            order.OrderStatus = "Delivered";
            _fanHubContext.SaveChanges();
            return Ok($"Order with ID {orderId} status updated to 'Delivered'.");
        }

        [HttpPut("UpdateOrderStatusToWrongAddress/{orderId}")]
        public IActionResult UpdateOrderStatusToWrongAddress(int orderId)
        {
            var order = _fanHubContext.Orders.FirstOrDefault(o => o.OrderId == orderId);
            if (order == null)
            {
                return NotFound($"Order with ID {orderId} not found.");
            }
            order.OrderStatus = "WrongAddress";
            _fanHubContext.SaveChanges();
            return Ok($"Order with ID {orderId} status updated to 'WrongAddress'.");
        }


        [HttpPut("UpdateOrderStatusToReturned/{orderId}")]
        public IActionResult UpdateOrderStatusToReturned(int orderId)
        {
            var order = _fanHubContext.Orders.FirstOrDefault(o => o.OrderId == orderId);
            if (order == null)
            {
                return NotFound($"Order with ID {orderId} not found.");
            }
            order.OrderStatus = "Returned";
            _fanHubContext.SaveChanges();
            return Ok($"Order with ID {orderId} status updated to 'Returned'.");
        }





    }
}
