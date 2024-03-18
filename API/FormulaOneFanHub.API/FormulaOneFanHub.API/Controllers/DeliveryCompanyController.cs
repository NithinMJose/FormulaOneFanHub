﻿using System;
using System.IO;
using System.Linq;
using BCrypt.Net;
using FormulaOneFanHub.API.Data;
using FormulaOneFanHub.API.DTO;
using FormulaOneFanHub.API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryCompanyController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;
        private readonly IConfiguration _config;

        public DeliveryCompanyController(FormulaOneFanHubContxt fanHubContxt, IConfiguration configuration)
        {
            _fanHubContext = fanHubContxt;
            _config = configuration;
        }

        [HttpPost("CreateDeliveryCompany")]
        public IActionResult CreateDeliveryCompany([FromForm] DeliveryCompanyDto deliveryCompanyDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if a delivery company with the same name already exists
            if (_fanHubContext.DeliveryCompanies.Any(dc => dc.CompanyName == deliveryCompanyDto.CompanyName))
            {
                return Conflict($"A delivery company with the name '{deliveryCompanyDto.CompanyName}' already exists.");
            }

            // Generate UniqueName combining UUID and CompanyName
            string uniqueName = $"{Guid.NewGuid()}_{deliveryCompanyDto.CompanyName}";

            // Generate a random password
            string generatedPassword = GenerateRandomPassword(10); // You need to implement this method
            generatedPassword = "Manjadi@123";

            // Hash the password using BCrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(generatedPassword);

            // Save the uploaded image file and get the file path
            string imagePath = SaveImage(deliveryCompanyDto.ImageFile);

            // Set default status to "active"
            const string defaultStatus = "active";

            DeliveryCompany deliveryCompanyToCreate = new DeliveryCompany
            {
                UniqueName = uniqueName,
                Password = hashedPassword, // Set hashed password
                Email = deliveryCompanyDto.Email,
                CompanyName = deliveryCompanyDto.CompanyName,
                ContactNumber = deliveryCompanyDto.ContactNumber,
                CompanyStatus = defaultStatus, // Set default status
                Address = deliveryCompanyDto.Address,
                ImagePath = imagePath, // Set the image path
                CreatedOn = DateTime.Now
            };

            _fanHubContext.DeliveryCompanies.Add(deliveryCompanyToCreate);
            _fanHubContext.SaveChanges();

            // Send email to the registered company with their username and generated password
            SendEmailOnCreate(deliveryCompanyToCreate, generatedPassword);

            return StatusCode(201);
        }

        private void SendEmailOnCreate(DeliveryCompany deliveryCompany, string generatedPassword)
        {
            try
            {
                var emailApiKey = _config["EmailServer:SENDGRID_API_KEY"];
                var client = new SendGridClient(emailApiKey);
                var from = new EmailAddress("nithinjosemandownloadonly@gmail.com", "FormulaOneFanHub");
                var to = new EmailAddress(deliveryCompany.Email, deliveryCompany.CompanyName);
                var subject = "Your Delivery Company Account Details";

                // Create email content with username and password
                var plainTextContent = $"Username: {deliveryCompany.CompanyName}\nPassword: {generatedPassword}";
                var htmlContent = $"<strong>Your delivery company account is created successfully with FormulaOneFanHub.</strong><br/><br/><strong>Username:</strong> {deliveryCompany.CompanyName}<br/><strong>Password:</strong> {generatedPassword}";

                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = client.SendEmailAsync(msg).GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it)
            }
        }

        [HttpGet("GetDeliveryCompanies")]
        public IActionResult GetDeliveryCompanies()
        {
            var deliveryCompanies = _fanHubContext.DeliveryCompanies;
            return Ok(deliveryCompanies);
        }

        [HttpGet("GetDeliveryCompanyById")]
        public IActionResult GetDeliveryCompanyById(int id)
        {
            var deliveryCompany = _fanHubContext.DeliveryCompanies.Find(id);
            return Ok(deliveryCompany);
        }

        // Helper method to save the image file and return the file path
        private string SaveImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return null;
            }

            var fileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
            var filePath = Path.Combine("wwwroot/images", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                imageFile.CopyTo(stream);
            }

            return fileName;
        }

        // Helper method to generate a random password
        private string GenerateRandomPassword(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
