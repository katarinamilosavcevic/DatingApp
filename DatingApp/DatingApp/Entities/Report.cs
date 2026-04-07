namespace DatingApp.Entities
{
    public class Report
    {
        public int Id { get; set; }

        public required string ReporterId { get; set; }
        public Member Reporter { get; set; } = null!;

        public required string ReportedUserId { get; set; }
        public Member ReportedUser { get; set; } = null!;

        public required ReportReason Reason { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
