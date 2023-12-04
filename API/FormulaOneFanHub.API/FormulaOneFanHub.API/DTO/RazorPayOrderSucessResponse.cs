namespace FormulaOneFanHub.API.DTO
{
    public class RazorPayOrderSucessResponse
    {
        public string id { get; set; }
        public string entity { get; set; }
        public int amount { get; set; }
        public int amount_paid { get; set; }
        public int amount_due { get; set; }
        public string currency { get; set; }
        public string receipt { get; set; }
        public object offer_id { get; set; }
        public string status { get; set; }
        public int attempts { get; set; }
        public Notes? notes { get; set; }
        public long created_at { get; set; }
    }

    public class Notes
    {
        public string key1 { get; set; }
        public string key2 { get; set; }
    }
}