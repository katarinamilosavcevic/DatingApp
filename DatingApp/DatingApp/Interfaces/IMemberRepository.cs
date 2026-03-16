using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Interfaces
{
    public interface IMemberRepository
    {
        void Update(Member member);
        Task<bool> SaveAllAsync();
        Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);
        Task<Member?> GetMemberByIdAsync(string id);
        Task<IReadOnlyList<Photo>> GetPhotoForMemberAsync(string memberId);
        Task<Member?> GetMemberForUpdate(string id);
    }
}
