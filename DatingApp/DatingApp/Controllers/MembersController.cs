using DatingApp.Data;
using DatingApp.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    [Route("api/[controller]")]  //localhost:5154/api/members
    [ApiController]
    public class MembersController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var memebers = await context.Users.ToListAsync();
            return memebers;
        }

        [HttpGet("{id}")]   //localhost:5154/api/members/bob-id
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var members = await context.Users.FindAsync(id);

            if(members == null) return NotFound();
            return members;
        }
    }
}
