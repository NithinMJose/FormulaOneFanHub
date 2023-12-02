namespace FormulaOneFanHub.API.DTO
{
    public class RazorPayOrderFailureResponse
    {
        public ErrorDetail Error { get; set; }

        public class ErrorDetail
        {
            public string Code { get; set; }
            public string Description { get; set; }
            public string Source { get; set; }
            public string Step { get; set; }
            public string Reason { get; set; }
            public Dictionary<string, object> Metadata { get; set; }
            public string Field { get; set; }
        }
    }

}
