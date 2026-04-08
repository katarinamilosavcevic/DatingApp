using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace DatingApp.Data
{
    public class BlockingRepository(AppDbContext context) : IBlockingRepository
    {
        public async Task<bool> BlockUserAsync(string sourceId, string targetId)
        {
            var block = new BlockedUser
            {
                SourceMemberId = sourceId,
                TargetMemberId = targetId
            };
            context.BlockedUsers.Add(block);
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<PaginatedResult<Member>> GetBlockedMembersAsync(BlockingParams blockingParams)
        {
            var query = context.BlockedUsers
                .Where(x => x.SourceMemberId == blockingParams.MemberId)
                .Select(x => x.TargetMember);

            return await PaginationHelper.CreateAsync(query, blockingParams.PageNumber, blockingParams.PageSize);
        }

        public async Task<IReadOnlyList<string>> GetBlockedUserIdsAsync(string memberId)
        {
            return await context.BlockedUsers
                .Where(x => x.SourceMemberId == memberId)
                .Select(x => x.TargetMemberId)
                .ToListAsync();
        }

        public async Task<bool> IsBlockedAsync(string sourceId, string targetId)
        {
            return await context.BlockedUsers.AnyAsync(x => x.SourceMemberId == sourceId && x.TargetMemberId == targetId);
        }

        public async Task<bool> IsEitherBlockedAsync(string userId1, string userId2)
        {
            return await context.BlockedUsers
                .AnyAsync(x => (x.SourceMemberId == userId1 && x.TargetMemberId == userId2) || (x.SourceMemberId == userId2 && x.TargetMemberId == userId1));
        }

        public async Task<bool> UnblockUserAsync(string sourceId, string targetId)
        {
            var block = await context.BlockedUsers.FirstOrDefaultAsync(x => x.SourceMemberId == sourceId && x.TargetMemberId == targetId);
            if (block == null) return false;
            context.BlockedUsers.Remove(block);
            return await context.SaveChangesAsync() > 0;
        }
    }
}
