namespace DatingApp.Entities
{
    public class BlockedUser
    {
        public required string SourceMemberId { get; set; }
        public Member SourceMember { get; set; } = null!;

        public required string TargetMemberId { get; set; }
        public Member TargetMember { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
