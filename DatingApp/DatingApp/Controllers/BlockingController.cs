using DatingApp.Extensions;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [Authorize]

    public class BlockingController(IUnitOfWork uow) : BaseApiController
    {

        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> BlockUser(string targetMemberId)
        {
            var sourceId = User.GetMemberId();

            if (sourceId == targetMemberId) return BadRequest("You cannot block yourself");

            var alreadyBlocked = await uow.BlockingRepository.IsBlockedAsync(sourceId, targetMemberId);
            if (alreadyBlocked) return BadRequest("User is already blocked");


            var result = await uow.BlockingRepository.BlockUserAsync(sourceId, targetMemberId);
            if (!result) return BadRequest("Failed to block user");

            var like1 = await uow.LikesRepository.GetMemberLike(sourceId, targetMemberId);
            if (like1 != null) uow.LikesRepository.DeleteLike(like1);

            var like2 = await uow.LikesRepository.GetMemberLike(targetMemberId, sourceId);
            if (like2 != null) uow.LikesRepository.DeleteLike(like2);

            await uow.Complete();

            return Ok();
        }


        [HttpDelete("{targetMemberId}")]
        public async Task<ActionResult> UnblockUser(string targetMemberId)
        {
            var sourceId = User.GetMemberId();

            var result = await uow.BlockingRepository.UnblockUserAsync(sourceId, targetMemberId);
            if (!result) return BadRequest("Failed to unblock user");

            return Ok();
        }



        [HttpGet]
        public async Task<ActionResult> GetBlockedUsers([FromQuery] BlockingParams blockingParams)
        {
            blockingParams.MemberId = User.GetMemberId();
            var result = await uow.BlockingRepository.GetBlockedMembersAsync(blockingParams);

            return Ok(result);
        }



    }
}
