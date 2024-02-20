using FormulaOneFanHub.API.Entities;
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;

namespace FormulaOneFanHub.API.Utilities
{
    public class EmailSendUtilityBan
    {
        private readonly IConfiguration _config;

        public EmailSendUtilityBan(IConfiguration configuration)
        {
            _config = configuration;
        }

        public void SendEmailBan(User userInfo, string reason)
        {
            try
            {
                var emailApiKey = _config["EmailServer:SENDGRID_API_KEY"];
                var client = new SendGridClient(emailApiKey);
                var from = new EmailAddress("nithinjosemandownloadonly@gmail.com", "FormulaOneFanHub");
                var subject = "Your FormulaOne FanHub Account Has Been Banned";
                var to = new EmailAddress(userInfo.Email, $"{userInfo.FirstName} {userInfo.LastName}");
                var plainTextContent = $"Dear {userInfo.FirstName},\n\nYour FormulaOne FanHub account has been banned due to the following reason:\n\n{reason}\n\nPlease contact the administrators for further assistance.\n\nBest regards,\nFormulaOneFanHub Team";
                var htmlContent = $"<p>Dear {userInfo.FirstName},</p><p>Your FormulaOne FanHub account has been banned due to the following reason:</p><p><strong>{reason}</strong></p><p>Please contact the administrators for further assistance.</p><p>Best regards,<br />FormulaOneFanHub Team</p>";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = client.SendEmailAsync(msg).GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it)
            }
        }
    }
}
