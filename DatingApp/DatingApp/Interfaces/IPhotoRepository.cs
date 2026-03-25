using DatingApp.DTOs;
using DatingApp.Entities;

namespace DatingApp.Interfaces
{
    public interface IPhotoRepository
    {

        Task<IReadOnlyList<PhotoForApprovalDto>> GetUnapprovedPhotos();
        Task<Photo?> GetPhotoById(int id);
        void RemovePhoto(Photo photo);

    }
}
