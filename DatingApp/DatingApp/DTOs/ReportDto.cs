using DatingApp.Entities;

namespace DatingApp.DTOs
{
    public class ReportDto
    {
        public required ReportReason Reason { get; set; }
        public string? Description { get; set; }
    }
}
