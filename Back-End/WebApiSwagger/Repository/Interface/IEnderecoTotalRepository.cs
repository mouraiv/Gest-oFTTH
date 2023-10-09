using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository.Interface
{
    public interface IEnderecoTotalRepository
    {
        Task<EnderecoTotal> CarregarId(FiltroEnderecoTotalAny filtro);
        Task<IEnumerable<EnderecoTotal>> Listar(FiltroEnderecoTotal filtro, Paginacao paginacao);
    }
}
