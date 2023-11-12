using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class TicketCategoryDto
    {
        public int TicketCategoryId { get; set; }

        [Required(ErrorMessage = "CategoryName is required")]
        public string CategoryName { get; set; }

        public string Description { get; set; }

        [Required(ErrorMessage = "TicketPrice is required")]
        public int TicketPrice { get; set; }
    }
}
