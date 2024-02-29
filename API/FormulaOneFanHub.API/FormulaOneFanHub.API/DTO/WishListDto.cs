// WishListDto.cs
using System.ComponentModel.DataAnnotations;

namespace FormulaOneFanHub.API.Dtos
{
    public class WishListDto
    {
        [Required(ErrorMessage = "Product ID is required")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
    }
}
