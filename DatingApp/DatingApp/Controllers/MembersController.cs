using DatingApp.Data;
using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [Authorize]

    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepository.GetMembersAsync());
        }

        
        [HttpGet("{id}")]   //localhost:5154/api/members/bob-id
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var members = await memberRepository.GetMemberByIdAsync(id);

            if(members == null) return NotFound();
            return members;
        }


        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhoto(string id)
        {
            return Ok(await memberRepository.GetPhotoForMemberAsync(id));
        }



    }
}
