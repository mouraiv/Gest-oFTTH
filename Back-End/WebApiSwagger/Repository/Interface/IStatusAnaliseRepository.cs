using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IStatusAnaliseRepository
    {
        Task<StatusAnalise> Inserir(StatusAnalise StatusAnalise);
        Task<StatusAnalise> Editar(int id, StatusAnalise StatusAnalise);
        Task<bool> Deletar(int id);
        Task<StatusAnalise> CarregarId(int id);
        Task<IEnumerable<StatusAnalise>> Listar();
    }
}