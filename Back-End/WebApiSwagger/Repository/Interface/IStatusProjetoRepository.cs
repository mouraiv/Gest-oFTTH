using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IStatusProjetoRepository
    {
        Task<StatusProjeto> Inserir(StatusProjeto StatusProjeto);
        Task<StatusProjeto> Editar(int id, StatusProjeto StatusProjeto);
        Task<bool> Deletar(int id);
        Task<StatusProjeto> CarregarId(int id);
        Task<IEnumerable<StatusProjeto>> Listar();
    }
}