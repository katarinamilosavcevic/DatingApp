using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class MemberRepository(AppDbContext context) : IMemberRepository
    {
        public async Task<Member?> GetMemberByIdAsync(string id)
        {
            return await context.Members.FindAsync(id);
        }



        public async Task<Member?> GetMemberForUpdateAsync(string id)
        {
            return await context.Members
               .Include(x => x.User)
               .Include(x => x.Photos)
               .IgnoreQueryFilters()
               .SingleOrDefaultAsync(x => x.Id == id);
        }



        public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
        {
            var query = context.Members.AsQueryable();
            query = query.Where(x => x.Id != memberParams.CurrentMemberId);

            var blockedIds = await context.BlockedUsers
                    .Where(x => x.SourceMemberId == memberParams.CurrentMemberId || x.TargetMemberId == memberParams.CurrentMemberId)
                    .Select(x => x.SourceMemberId == memberParams.CurrentMemberId ? x.TargetMemberId : x.SourceMemberId)
                    .ToListAsync();

            if (blockedIds.Count > 0) query = query.Where(x => !blockedIds.Contains(x.Id));

            if (memberParams.Gender != null) {
                query = query.Where(x => x.Gender == memberParams.Gender);
            }

            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

            query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

            query = memberParams.OrderBy switch
            {
                "created" => query.OrderByDescending(x => x.Created),
                _ => query.OrderByDescending(x => x.LastActive)
            };

            return await PaginationHelper.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
        }



        public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId, bool isCurrentUser)
        {
            var query = context.Members
               .Where(x => x.Id == memberId)
               .SelectMany(x => x.Photos);
   
            if (isCurrentUser) query = query.IgnoreQueryFilters();
            
            return await query.ToListAsync();
        }




        public void Update(Member member)
        {
            context.Entry(member).State = EntityState.Modified;
        }
    }
}
