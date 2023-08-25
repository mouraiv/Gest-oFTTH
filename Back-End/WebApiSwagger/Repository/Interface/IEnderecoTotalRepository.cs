using WebApiSwagger.Models;
using WebApiSwagger.Filters;

namespace WebApiSwagger.Repository.Interface
{
    public interface IEnderecoTotalRepository
    {
        Task<EnderecoTotal> CarregarId(int id);
        Task<IEnumerable<EnderecoTotal>> Listar(FiltroEnderecoTotal filtro);
    }
}
