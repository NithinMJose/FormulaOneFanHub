using System;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using QuestPDF.Previewer;
using QuestPDF.Helpers;
using FormulaOneFanHub.API.Data;
using IronPdf;
using System.IO;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace FormulaOneFanHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfGeneratorController : ControllerBase
    {
        private readonly FormulaOneFanHubContxt _fanHubContext;

        public PdfGeneratorController(FormulaOneFanHubContxt fanHubContext)
        {
            _fanHubContext = fanHubContext;
        }

        [HttpGet("GeneratePdf")]
        public IActionResult GeneratePdf()
        {
            // Retrieve data from the SoldItem table
            var soldItems = _fanHubContext.SoldItems
                .Include(s => s.Product)
                .ToList();

            // Create a new HTML to PDF renderer
            var renderer = new HtmlToPdf();

            // Generate the HTML content
            var htmlContent = new StringBuilder();
            htmlContent.Append("<h1>Formula One Fan Hub</h1>");
            htmlContent.Append("<h2>Selling Report</h2>");
            htmlContent.Append("<table>");
            htmlContent.Append("<tr><th>Product Name</th><th>Quantity</th><th>Price Per Item</th><th>Total Price</th><th>Sold Date</th></tr>");
            foreach (var item in soldItems)
            {
                htmlContent.Append($"<tr><td>{item.Product.ProductName}</td><td>{item.Quantity}</td><td>{item.PricePerItem}</td><td>{item.TotalPrice}</td><td>{item.SoldDate}</td></tr>");
            }
            htmlContent.Append("</table>");

            // Render the HTML content to a PDF
            var pdf = renderer.RenderHtmlAsPdf(htmlContent.ToString());

            // Generate a UUID for the file name
            var uuid = Guid.NewGuid().ToString();
            var fileName = $"{uuid}.pdf";

            // Return the PDF file as a FileResult
            return File(pdf.BinaryData, "application/pdf", fileName);
        }

    }
}