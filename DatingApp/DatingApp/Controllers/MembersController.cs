using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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



        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            var member = await memberRepository.GetMemberForUpdate(memberId);

            if (member == null) return BadRequest("Could not get member.");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            // memberRepository.Update(member); //optional

            if(await memberRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update member");
        }

    }
}
