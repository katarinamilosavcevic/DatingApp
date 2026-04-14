using DatingApp.Controllers;
using DatingApp.Entities;
using DatingApp.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace DatingApp.Tests.Controllers
{
    public class BlockingControllerTests
    {

        private readonly Mock<IUnitOfWork> _uowMock;
        private readonly Mock<IBlockingRepository> _blockingRepoMock;
        private readonly Mock<ILikesRepository> _likesRepoMock;
        private readonly BlockingController _sut;

        public BlockingControllerTests()
        {
            _uowMock = new Mock<IUnitOfWork>();
            _blockingRepoMock = new Mock<IBlockingRepository>();
            _likesRepoMock = new Mock<ILikesRepository>();

            _uowMock.Setup(u => u.BlockingRepository).Returns(_blockingRepoMock.Object);
            _uowMock.Setup(u => u.LikesRepository).Returns(_likesRepoMock.Object);

            _sut = new BlockingController(_uowMock.Object);

            var claims = new List<Claim>
            {
               new Claim(ClaimTypes.NameIdentifier, "user-1")
            };

            var identity = new ClaimsIdentity(claims, "TestAuth");
            _sut.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
            };
        }


        [Fact]
        public async Task BlockUser_ReturnsOk_WhenSuccessful()
        {
            _blockingRepoMock.Setup(r => r.IsBlockedAsync("user-1", "user-2")).ReturnsAsync(false);
            _blockingRepoMock.Setup(r => r.BlockUserAsync("user-1", "user-2")).ReturnsAsync(true);
            _likesRepoMock.Setup(r => r.GetMemberLike(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync((MemberLike?)null);
            _uowMock.Setup(u => u.Complete()).ReturnsAsync(true);

            var result = await _sut.BlockUser("user-2");

            result.Should().BeOfType<OkResult>();
        }


        [Fact]
        public async Task BlockUser_ReturnsBadRequest_WhenBlockingSelf()
        {
            var result = await _sut.BlockUser("user-1");

            var badRequest = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequest.Value.Should().Be("You cannot block yourself");
        }


        [Fact]
        public async Task BlockUser_ReturnsBadRequest_WhenAlreadyBlocked()
        {
            _blockingRepoMock.Setup(r => r.IsBlockedAsync("user-1", "user-2")).ReturnsAsync(true);

            var result = await _sut.BlockUser("user-2");

            var badRequest = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequest.Value.Should().Be("User is already blocked");
        }

        [Fact]
        public async Task BlockUser_ReturnsBadRequest_WhenRepositoryFails()
        {
            _blockingRepoMock.Setup(r => r.IsBlockedAsync("user-1", "user-2")).ReturnsAsync(false);
            _blockingRepoMock.Setup(r => r.BlockUserAsync("user-1", "user-2")).ReturnsAsync(false);

            var result = await _sut.BlockUser("user-2");

            var badRequest = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequest.Value.Should().Be("Failed to block user");
        }



        [Fact]
        public async Task BlockUser_DeletesLikes_WhenBlockIsSuccessful()
        {
            var like1 = new MemberLike { SourceMemberId = "user-1", TargetMemberId = "user-2" };
            var like2 = new MemberLike { SourceMemberId = "user-2", TargetMemberId = "user-1" };

            _blockingRepoMock.Setup(r => r.IsBlockedAsync("user-1", "user-2")).ReturnsAsync(false);
            _blockingRepoMock.Setup(r => r.BlockUserAsync("user-1", "user-2")).ReturnsAsync(true);
            _likesRepoMock.Setup(r => r.GetMemberLike("user-1", "user-2")).ReturnsAsync(like1);
            _likesRepoMock.Setup(r => r.GetMemberLike("user-2", "user-1")).ReturnsAsync(like2);
            _uowMock.Setup(u => u.Complete()).ReturnsAsync(true);

            await _sut.BlockUser("user-2");

            _likesRepoMock.Verify(r => r.DeleteLike(like1), Times.Once);
            _likesRepoMock.Verify(r => r.DeleteLike(like2), Times.Once);
        }

        [Fact]
        public async Task UnblockUser_ReturnsOk_WhenSuccessful()
        {
            _blockingRepoMock.Setup(r => r.UnblockUserAsync("user-1", "user-2")).ReturnsAsync(true);

            var result = await _sut.UnblockUser("user-2");

            result.Should().BeOfType<OkResult>();
        }



        [Fact]
        public async Task UnblockUser_ReturnsBadRequest_WhenNotBlocked()
        {
            _blockingRepoMock.Setup(r => r.UnblockUserAsync("user-1", "user-2")).ReturnsAsync(false);

            var result = await _sut.UnblockUser("user-2");

            var badRequest = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequest.Value.Should().Be("Failed to unblock user");
        }








    }
}
