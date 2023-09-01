using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface ITecnicoRepository
    {
        Task<Tecnico> Inserir(Tecnico Tecnico);
        Task<Tecnico> Editar(int id, Tecnico Tecnico);
        Task<bool> Deletar(int id);
        Task<Tecnico> CarregarId(int id);
        Task<IEnumerable<Tecnico>> Listar();
    }
}