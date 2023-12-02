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
            var requestContent = BuildOrderRequest(amount, receipt, notes, client);


            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(_configuration["RazorPay:Key"] + ":" + _configuration["RazorPay:Secret"])));
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

        private HttpContent? BuildOrderRequest(decimal amount, string receipt, string notes, HttpClient client)
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
