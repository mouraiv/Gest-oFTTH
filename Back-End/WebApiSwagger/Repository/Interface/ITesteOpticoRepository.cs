using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository.Interface
{
    public interface ITesteOpticoRepository
    {
        Task<TesteOptico> Inserir(TesteOptico testeOptico);
        Task<TesteOptico> Editar(int id, TesteOptico testeOptico);
        Task<bool> Deletar(int id);
        Task<TesteOptico> CarregarId(int id);
        Task<List<string?>> ListaUnica(string coluna);
        Task<IEnumerable<TesteOptico>> Listar(FiltroTesteOptico filtro, Paginacao paginacao);
    }
}