using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IDiretorioRepository
    {
        Task<Diretorio> ReadDiretorio(int id);
        
    }
}