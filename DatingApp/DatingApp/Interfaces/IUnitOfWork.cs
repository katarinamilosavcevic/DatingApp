namespace DatingApp.Interfaces
{
    public interface IUnitOfWork
    {
        IMemberRepository MemberRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikesRepository LikesRepository { get; }
        IPhotoRepository PhotoRepository { get; }
        IBlockingRepository BlockingRepository { get; }
        IReportRepository ReportRepository { get; }
        Task<bool> Complete();
        bool HasChanges();

    }
}
