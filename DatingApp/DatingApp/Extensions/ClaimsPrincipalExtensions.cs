using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace DatingApp.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetMemberId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Cannot get memberId from token.");
        }

    }
}
