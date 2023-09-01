namespace FormulaOneFanHub.API.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }

    }

}
