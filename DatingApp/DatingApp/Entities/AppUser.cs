using Microsoft.AspNetCore.Server.HttpSys;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace DatingApp.Entities
{
    public class AppUser : IdentityUser
    {
        public required string DisplayName { get; set; }
        public string? ImageUrl { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        // Navigation property
        //[ForeignKey(nameof(Id))]
        public Member Member { get; set; } = null!;

    }
}
