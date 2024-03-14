using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository.Interface
{
    public interface IMaterialRedeRepository
    {
        Task<MaterialRede> CarregarId(int? id_MaterialRede);
        Task<MaterialRede> CarregarChave(string? chave);
        Task<IEnumerable<MaterialRedeDropFilter>> ListaUnica(string uf, string cdo);
    }
}
