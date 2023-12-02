namespace FormulaOneFanHub.API.DTO
{
    public class RazorPayOrderSucessResponse
    {
        public string Id { get; set; }
        public string Entity { get; set; }
        public int Amount { get; set; }
        public int AmountPaid { get; set; }
        public int AmountDue { get; set; }
        public string Currency { get; set; }
        public string Receipt { get; set; }
        public object OfferId { get; set; }
        public string Status { get; set; }
        public int Attempts { get; set; }
        public List<object> Notes { get; set; }
        public int CreatedAt { get; set; }
    }
}