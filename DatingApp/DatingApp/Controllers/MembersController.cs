using DatingApp.Data;
using DatingApp.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
   
    public class MembersController(AppDbContext context) : BaseApiController
    {
        
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var memebers = await context.Users.ToListAsync();
            return memebers;
        }

        [Authorize]
        [HttpGet("{id}")]   //localhost:5154/api/members/bob-id
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var members = await context.Users.FindAsync(id);

            if(members == null) return NotFound();
            return members;
        }
    }
}
