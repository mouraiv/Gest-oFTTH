using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository.Interface
{
    public interface ILigacaoRepository
    {
        Task<Ligacao> CarregarId(int? id_Ligacao);
        Task<IEnumerable<Ligacao>> ListarCarregarId(int? id_MaterialRede);
    }
}
