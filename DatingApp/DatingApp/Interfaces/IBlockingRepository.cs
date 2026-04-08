using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Interfaces
{
    public interface IBlockingRepository
    {
        Task<bool> BlockUserAsync(string sourceId, string targetId);
        Task<bool> UnblockUserAsync(string sourceId, string targetId);
        Task<bool> IsBlockedAsync(string sourceId, string targetId);
        Task<bool> IsEitherBlockedAsync(string userId1, string userId2);
        Task<IReadOnlyList<string>> GetBlockedUserIdsAsync(string memberId);
        Task<PaginatedResult<Member>> GetBlockedMembersAsync(BlockingParams blockingParams);
    }
}
