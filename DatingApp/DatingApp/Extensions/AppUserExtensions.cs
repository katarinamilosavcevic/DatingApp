using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Interfaces;

namespace DatingApp.Extensions
{
    public static class AppUserExtensions
    {
        public static async Task<UserDto> ToDto(this AppUser user, ITokenService tokenService)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                DisplayName = user.DisplayName,
                ImageUrl = user.ImageUrl,
                Token = await tokenService.CreateToken(user)
            };
        }
    }
}
