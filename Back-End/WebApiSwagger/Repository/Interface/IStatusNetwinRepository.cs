using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IStatusNetwinRepository
    {
        Task<StatusNetwin> Inserir(StatusNetwin StatusNetwin);
        Task<StatusNetwin> Editar(int id, StatusNetwin StatusNetwin);
        Task<bool> Deletar(int id);
        Task<StatusNetwin> CarregarId(int id);
        Task<IEnumerable<StatusNetwin>> Listar();
    }
}