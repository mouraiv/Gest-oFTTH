using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository.Interface
{
    public interface IStatusLoginRepository
    {
        Task<StatusLogin> CarregarId(int id);
        Task<StatusLogin> Inserir(StatusLogin statusLogin);
        Task<StatusLogin> Editar(int id, StatusLogin statusLogin);
    }
}
