using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormulaOneFanHub.API.Entities
{
    public class Corner
    {
        [Key]
        public int CornerId { get; set; }

        [Required(ErrorMessage = "CornerNumber is required")]
        public int CornerNumber { get; set; }

        [Required(ErrorMessage = "CornerCapacity is required")]
        public int CornerCapacity { get; set; }

        [Required(ErrorMessage = "RaceId is required")]
        public int RaceId { get; set; }

        public Race Race { get; set; } // Navigation property for the related Race entity
    }
}
