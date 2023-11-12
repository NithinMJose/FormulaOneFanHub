using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class TicketCategory
    {
        [Key]
        public int TicketCategoryId { get; set; }

        [Required(ErrorMessage = "CategoryName is required")]
        public string CategoryName { get; set; }

        public string Description { get; set; }

        //[Required(ErrorMessage = "TicketPrice is required")]
        public required int TicketPrice { get; set; }

        // If you want to associate a corner with a ticket category, you can add a foreign key
        // public int? CornerId { get; set; }
        // public Corner Corner { get; set; }

        // If you want to associate a race with a ticket category, you can add a foreign key
        // public int RaceId { get; set; }
        // public Race Race { get; set; }
    }
}

