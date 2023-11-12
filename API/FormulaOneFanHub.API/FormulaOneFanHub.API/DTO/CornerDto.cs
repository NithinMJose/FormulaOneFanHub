using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class CornerDto
    {
        public int CornerId { get; set; }

        [Required(ErrorMessage = "CornerNumber is required")]
        public int CornerNumber { get; set; }

        [Required(ErrorMessage = "CornerCapacity is required")]
        public int CornerCapacity { get; set; }

        [Required(ErrorMessage = "RaceId is required")]
        public int RaceId { get; set; }
    }
}
