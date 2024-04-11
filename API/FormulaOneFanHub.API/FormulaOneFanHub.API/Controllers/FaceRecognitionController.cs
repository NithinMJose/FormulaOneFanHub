using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FaceRecognitionController : ControllerBase
    {
        [HttpPost("CameraFeedReceiver")]
        public async Task<IActionResult> CameraFeedReceiver()
        {
            // Logic to continuously receive live camera feed goes here
            // For demonstration purposes, let's simulate receiving camera feed for 2 seconds
            // println to console every 5 seconds
            for (int i = 0; i < 4; i++)
            {
                await Task.Delay(5000);
                System.Console.WriteLine("Camera feed received");
            }


            // Return response
            return Ok("CameraFeed Received");
        }
    }
}
