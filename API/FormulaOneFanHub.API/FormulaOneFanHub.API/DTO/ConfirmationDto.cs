using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Entities
{
    public class ConfirmationDto
    {
        public int SeasonId { get; set; }
        public int RaceId { get; set; }
        public int CornerId { get; set; }
        public int TicketCategoryId { get; set; }

    }

}
