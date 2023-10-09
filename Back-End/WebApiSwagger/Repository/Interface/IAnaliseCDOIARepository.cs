using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IAnaliseCDOIARepository
    {
        Task<AnaliseCDOIA> Inserir(AnaliseCDOIA AnaliseCDOIA);
        Task<AnaliseCDOIA> Editar(int id, AnaliseCDOIA AnaliseCDOIA);
        Task<bool> Deletar(int id);
        Task<AnaliseCDOIA> CarregarId(int id);
        Task<IEnumerable<AnaliseCDOIA>> Listar();
    }
}