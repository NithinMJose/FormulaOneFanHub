namespace FormulaOneFanHub.API.Entities
{
    public class ErrorLog
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public string? Source { get; set; }
        public string? StackTrace { get; set; }
        public string? TargetSite { get; set; }
        public string? InnerException { get; set; }
        public string? Data { get; set; }
        public string? HelpLink { get; set; }
        public string? HResult { get; set; }
        public string? Type { get; set; }
        public string? User { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
