using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [Authorize]

    public class ReportController(IUnitOfWork uow) : BaseApiController
    {

        [HttpPost("{reportedUserId}")]
        public async Task<ActionResult> ReportUser(string reportedUserId, ReportDto reportDto)
        {
            var reporterId = User.GetMemberId();

            if (reporterId == reportedUserId) return BadRequest("You cannot report yourself");

            var report = new Report
            {
                ReporterId = reporterId,
                ReportedUserId = reportedUserId,
                Reason = reportDto.Reason,
                Description = reportDto.Description
            };

            await uow.ReportRepository.AddReportAsync(report);

            if (await uow.Complete()) return Ok();
            return BadRequest("Failed to submit report");
        }


        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult> GetReports()
        {
            var reports = await uow.ReportRepository.GetReportsAsync();
            return Ok(reports);
        }



        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/resolve")]
        public async Task<ActionResult> ResolveReport(int id)
        {
            var report = await uow.ReportRepository.GetReportByIdAsync(id);
            if (report == null) return NotFound();

            report.Status = "Resolved";

            if (await uow.Complete()) return Ok();
            return BadRequest("Failed to resolve report");
        }

    }
}
