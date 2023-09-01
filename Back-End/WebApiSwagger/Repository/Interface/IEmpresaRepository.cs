using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IEmpresaRepository
    {
        Task<Empresa> Inserir(Empresa Empresa);
        Task<Empresa> Editar(int id, Empresa Empresa);
        Task<bool> Deletar(int id);
        Task<Empresa> CarregarId(int id);
        Task<IEnumerable<Empresa>> Listar();
    }
}