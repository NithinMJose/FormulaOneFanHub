namespace FormulaOneFanHub.API.DTO
{
    public class RazorPayOrderResponseResult
    {
        public bool IsSuccess { get; set; }
        public RazorPayOrderSucessResponse? SuccessResponse { get; set; }
        public RazorPayOrderFailureResponse? ErrorResponse { get; set; }
    }
}
