using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository.Interface
{
    public interface ITesteOpticoRepository
    {
        Task<TesteOptico> Inserir(TesteOptico testeOptico);
        Task<TesteOptico> Editar(int id, TesteOptico testeOptico);
        Task<TesteOptico> Unique(string uf, string estacao, string cdo);
        Task<bool> Deletar(int id);
        Task<TesteOptico> CarregarId(int id);
        Task<IEnumerable<TesteOptico>> ListaUnica();
        Task<IEnumerable<TesteOptico>> Listar(IProgressoRepository progressoRepository,FiltroTesteOptico filtro, Paginacao paginacao);
        Task<IEnumerable<ControleCampoViewModel>> ControleCampo(IProgressoRepository progressoRepository,FiltroTesteOptico filtro, Paginacao paginacao, int pageOff);
        Task<IEnumerable<TesteOptico>> ControlerCdo(IProgressoRepository progressoRepository,FiltroTesteOptico filtro, Paginacao paginacao);
        string ObterViabilidade(string viabCodigo);
    }
}