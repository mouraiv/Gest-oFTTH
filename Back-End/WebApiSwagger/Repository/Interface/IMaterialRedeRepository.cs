using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository.Interface
{
    public interface IMaterialRedeRepository
    {
        Task<MaterialRede> CarregarId(int? id_MaterialRede);
    }
}
