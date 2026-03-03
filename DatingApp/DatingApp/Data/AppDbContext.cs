using DatingApp.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<AppUser> Users { get; set; }

    }
}
