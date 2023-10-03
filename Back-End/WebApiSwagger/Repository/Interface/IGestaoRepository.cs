using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IGestaoRepository
    {
        Task<Gestao> Inserir(Gestao Gestao);
        Task<Gestao> Editar(int id, Gestao Gestao);
        Task<bool> Deletar(int id);
        Task<Gestao> CarregarId(int id);
        Task<IEnumerable<Gestao>> Listar();
    }
}