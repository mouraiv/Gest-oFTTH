using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IInfoRepository
    {
        Task<Info> CarregarId(int? id_MaisDeUmaCDO);
        Task<bool> Deletar(int id);
        Task<Info> Editar(int id, Info info);
        Task<Info> Inserir(Info info);
        Task<IEnumerable<Info>> Listar();
    }
}
