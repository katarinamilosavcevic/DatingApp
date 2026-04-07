using DatingApp.Entities;

namespace DatingApp.Interfaces
{
    public interface IReportRepository
    {
        Task AddReportAsync(Report report);
        Task<IReadOnlyList<Report>> GetReportsAsync();
        Task<Report?> GetReportByIdAsync(int id);
    }
}
