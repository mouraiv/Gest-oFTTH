using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository.Interface
{
    public interface IServicoAssociadoRepository
    {
        Task<ServicoAssociado> CarregarId(int? id_ServicoAssociado);
        Task<bool> Deletar(int id);
        Task<ServicoAssociado> Editar(int id, ServicoAssociado servicoAssociado);
        Task<ServicoAssociado> Inserir(ServicoAssociado servicoAssociado);
        Task<IEnumerable<ServicoAssociado>> Listar(string survey);
    }
}
