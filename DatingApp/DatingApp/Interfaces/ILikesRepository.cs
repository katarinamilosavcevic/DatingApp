using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Interfaces
{
    public interface ILikesRepository
    {

        Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);
        Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams);
        Task<IReadOnlyList<string>> GetCurrentMeemberLikeIds(string memberId);
        void DeleteLike(MemberLike like);
        void AddLike(MemberLike like);
        Task<bool> SaveAllChanges();

    }
}
