using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface ICargoRepository
    {
        Task<Cargo> Inserir(Cargo Cargo);
        Task<Cargo> Editar(int id, Cargo Cargo);
        Task<bool> Deletar(int id);
        Task<Cargo> CarregarId(int id);
        Task<IEnumerable<Cargo>> Listar();
    }
}