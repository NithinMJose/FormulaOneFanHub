using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class RazorPayOrderDto
    {
        public int Amount { get; set; }
        public string Currency { get; set; }
        public DateTime Receipt { get; set; }
        
    }

}
