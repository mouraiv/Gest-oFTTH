using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IInfoRepository
    {
        Task<IEnumerable<Info>> Listar();
    }
}
