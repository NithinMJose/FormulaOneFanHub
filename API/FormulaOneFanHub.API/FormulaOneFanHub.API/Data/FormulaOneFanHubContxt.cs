using FormulaOneFanHub.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace FormulaOneFanHub.API.Data
{
    public class FormulaOneFanHubContxt : DbContext
    {
        public FormulaOneFanHubContxt(DbContextOptions<FormulaOneFanHubContxt> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
             modelBuilder.Entity<TicketBooking>()
             .HasOne(tb => tb.Race)
             .WithMany()
             .HasForeignKey(tb => tb.RaceId)
             .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<OrderedItem>(entity =>
            {
                entity.HasOne(poi => poi.Order)
                .WithMany(po => po.OrderedItem)
                .HasForeignKey(poi => poi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            });


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
        public DbSet<TicketBooking> TicketBookings { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Poll> Polls { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<WishList> WishLists { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderedItem> OrderedItems { get; set; }

    }
}
