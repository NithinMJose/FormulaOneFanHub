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



            modelBuilder.Entity<SoldItem>(entity =>
            {
                entity.HasOne(si => si.Order)
                    .WithMany()
                    .HasForeignKey(si => si.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(si => si.Product)
                    .WithMany()
                    .HasForeignKey(si => si.ProductId)
                    .OnDelete(DeleteBehavior.Restrict); // You can adjust the delete behavior as per your requirement

                entity.HasOne(si => si.Team)
                    .WithMany()
                    .HasForeignKey(si => si.TeamId)
                    .OnDelete(DeleteBehavior.Restrict); // You can adjust the delete behavior as per your requirement
            });

            modelBuilder.Entity<Order>()
                .HasOne(o => o.DeliveryCompany)  // An Order belongs to one DeliveryCompany
                .WithMany()  // A DeliveryCompany can have many Orders
                .HasForeignKey(o => o.DeliveryCompanyId)  // Foreign key for the DeliveryCompany in Order table
                .OnDelete(DeleteBehavior.Restrict);  // You can adjust the delete behavior as per your requirement

            modelBuilder.Entity<TeamHistory>()
                .HasOne(th => th.Team)  // A TeamHistory belongs to one Team
                .WithMany(t => t.TeamHistories)  // A Team can have many TeamHistories
                .HasForeignKey(th => th.TeamId)  // Foreign key for the Team in TeamHistory table
                .OnDelete(DeleteBehavior.Restrict);  // You can adjust the delete behavior as per your requirement

            modelBuilder.Entity<Topic>()
                .HasOne(t => t.Team)  // A Topic belongs to one Team
                .WithMany(t => t.Topics)  // A Team can have many Topics
                .HasForeignKey(t => t.TeamId)  // Foreign key for the Team in Topic table
                .OnDelete(DeleteBehavior.Restrict);  // You can adjust the delete behavior as per your requirement

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
        public DbSet<SoldItem> SoldItems { get; set; }
        public DbSet<DeliveryCompany> DeliveryCompanies { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<AttendanceRegister> AttendanceRegisters { get; set; }

    }
}