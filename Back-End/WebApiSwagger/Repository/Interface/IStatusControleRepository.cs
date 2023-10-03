using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IStatusControleRepository
    {
        Task<StatusControle> Inserir(StatusControle StatusControle);
        Task<StatusControle> Editar(int id, StatusControle StatusControle);
        Task<bool> Deletar(int id);
        Task<StatusControle> CarregarId(int id);
        Task<IEnumerable<StatusControle>> Listar();
    }
}