using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Interfaces
{
    public interface IMemberRepository
    {
        void Update(Member member);
        
        Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);
        Task<Member?> GetMemberByIdAsync(string id);
        Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId, bool isCurrentUser);
        Task<Member?> GetMemberForUpdateAsync(string id);
    }
}
