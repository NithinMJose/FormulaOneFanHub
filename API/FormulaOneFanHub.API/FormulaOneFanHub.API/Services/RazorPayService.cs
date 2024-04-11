using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Azure.Core;
using FormulaOneFanHub.API.DTO;

namespace FormulaOneFanHub.API.Services
{
    public class RazorPayService
    {
        private readonly IConfiguration _configuration;
        public RazorPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public RazorPayOrderResponseResult CreateOrder(decimal amount, string receipt, string notes)
        {
            var client = new HttpClient();
            var requestContent = BuildOrderRequest(amount, receipt, notes);

            var razorKey = _configuration["RazorPay:Key"];
            var razorKeySecret = _configuration["RazorPay:KeySecret"];

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                        Convert.ToBase64String(Encoding.UTF8.GetBytes(razorKey + ":" + razorKeySecret)));

            var response = client.PostAsync("https://api.razorpay.com/v1/orders", requestContent).GetAwaiter().GetResult();
            var responseContent = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

            RazorPayOrderResponseResult razorPayOrderResponse = null;

            if (response.IsSuccessStatusCode)
            {
                var razorPayOrderSuccessResponse = JsonSerializer.Deserialize<RazorPayOrderSucessResponse>(responseContent);
                razorPayOrderResponse = new RazorPayOrderResponseResult
                {
                    IsSuccess = true,
                    SuccessResponse = razorPayOrderSuccessResponse
                };
            }
            else
            {
                var razorPayOrderFailureResponse = JsonSerializer.Deserialize<RazorPayOrderFailureResponse>(responseContent);
                razorPayOrderResponse = new RazorPayOrderResponseResult
                {
                    IsSuccess = false,
                    ErrorResponse = razorPayOrderFailureResponse
                };
                
            }
            return razorPayOrderResponse;
           
        }

        private HttpContent? BuildOrderRequest(decimal amount, string receipt, string notes)
        {
            var requestContent = new StringContent(JsonSerializer.Serialize(new
            {
                amount = amount,
                currency = "INR",
                receipt = receipt,
                notes = new
                {
                    key1 = notes,
                    key2 = "value2"
                }
            }), Encoding.UTF8, "application/json");

            return requestContent;
        }



    }
}
