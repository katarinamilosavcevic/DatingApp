using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class LikesRepository(AppDbContext context) : ILikesRepository
    {
        public void AddLike(MemberLike like)
        {
            context.Likes.Add(like);
        }

        public void DeleteLike(MemberLike like)
        {
            context.Likes.Remove(like);
        }

        public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
        {
            return await context.Likes
                .Where(x => x.SourceMemberId == memberId)
                .Select(x => x.TargetMemberId)
                .ToListAsync();
        }

        public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
        {
            return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
        }

        public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams)
        {
            var query = context.Likes.AsQueryable();
            IQueryable<Member> result;

            var blockedIds = await context.BlockedUsers
                    .Where(x => x.SourceMemberId == likesParams.MemberId || x.TargetMemberId == likesParams.MemberId)
                    .Select(x => x.SourceMemberId == likesParams.MemberId ? x.TargetMemberId : x.SourceMemberId)
                    .ToListAsync();

            switch (likesParams.Predicate)
            {
                case "liked":
                    result = query
                        .Where(like => like.SourceMemberId == likesParams.MemberId)
                        .Select(like => like.TargetMember)
                        .Where(m => !blockedIds.Contains(m.Id));
                    break;
                case "likedBy":
                    result = query
                        .Where(like => like.TargetMemberId == likesParams.MemberId)
                        .Select(like => like.SourceMember)
                        .Where(m => !blockedIds.Contains(m.Id));
                    break;
                default: //mutual
                    var likeIds = await GetCurrentMemberLikeIds(likesParams.MemberId);
                    result = query
                        .Where(x => x.TargetMemberId == likesParams.MemberId && likeIds.Contains(x.SourceMemberId))
                        .Select(x => x.SourceMember)
                        .Where(m => !blockedIds.Contains(m.Id));
                    break;

            }
            return await PaginationHelper.CreateAsync(result, likesParams.PageNumber, likesParams.PageSize);
           
        }

      
    }
}
