using FormulaOneFanHub.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace FormulaOneFanHub.API.Data
{
    public class FormulaOneFanHubContxt : DbContext
    {
        public FormulaOneFanHubContxt(DbContextOptions<FormulaOneFanHubContxt> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<ErrorLog> ErrorLogs { get; set; }
    }
}
