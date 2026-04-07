using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class ReportRepository(AppDbContext context) : IReportRepository
    {
        public async Task AddReportAsync(Report report)
        {
            context.Reports.Add(report);
        }

        public async Task<Report?> GetReportByIdAsync(int id)
        {
            return await context.Reports
                .Include(r => r.Reporter)
                .Include(r => r.ReportedUser)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IReadOnlyList<Report>> GetReportsAsync()
        {
            return await context.Reports
                .Include(r => r.Reporter)
                .Include(r => r.ReportedUser)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }
    }
}
