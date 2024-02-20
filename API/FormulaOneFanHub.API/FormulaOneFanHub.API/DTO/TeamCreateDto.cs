using Microsoft.AspNetCore.Http;
using System;

namespace FormulaOneFanHub.API.Entities
{
    public class TeamCreateDto
    {

        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
