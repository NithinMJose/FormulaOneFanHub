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
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<F1History> F1Histories { get; set; }
        public DbSet<TeamHistory> TeamHistories { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Race> Races { get; set; }
        public DbSet<Corner> Corners { get; set; }
        public DbSet<TicketCategory> TicketCategories { get; set; }


    }
}
