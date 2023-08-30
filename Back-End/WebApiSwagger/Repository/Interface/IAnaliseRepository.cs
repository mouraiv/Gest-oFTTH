using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IAnaliseRepository
    {
        Task<Analise> Inserir(Analise analise);
        Task<Analise> Editar(int id, Analise analise);
        Task<bool> Deletar(int id);
        Task<Analise> CarregarId(int id);
    }
}