using FormulaOneFanHub.API.Entities;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace FormulaOneFanHub.API.Utilities
{
    public class EmailSendUtility
    {
        private readonly IConfiguration _config;
        public EmailSendUtility(IConfiguration configuration)
        {
            _config = configuration;
        }
        public void SendEmail(User userInfo, string Otp )
        {
            try
            {
                var emailApiKey = _config["EmailServer:SENDGRID_API_KEY"];
                var client = new SendGridClient(emailApiKey);
                var from = new EmailAddress("nithinjose2024b@mca.ajce.in", "FormulaOneFanHub");
                var subject = "Your account is created with FormulaOne FanHub : Verify here";
                var to = new EmailAddress(userInfo.Email, $"{userInfo.FirstName} {userInfo.LastName}");
                //send the userinfo emailtoken as email body
                var plainTextContent = Otp;
                var htmlContent = $"<strong>Below is your OTP code to Confirm your FormulaoneHub Account : OTP :  {plainTextContent}</strong>";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = client.SendEmailAsync(msg).GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
            }
          
        }
    }
}
