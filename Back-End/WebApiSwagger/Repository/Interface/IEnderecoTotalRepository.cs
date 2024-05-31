using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;
using WebApiSwagger.Models.Base;

namespace WebApiSwagger.Repository.Interface
{
    public interface IEnderecoTotalRepository
    {
        Task<EnderecoTotal> CarregarId(int? id_MaterialRede, string? survey, bool filterSurvey);
        Task<EnderecoTotal> CarregarEnderecoTotalId(int? id_EnderecoTotal);
        Task<bool> Deletar(int id);
        Task<EnderecoTotal> Editar(int id, EnderecoTotal enderecoTotal);
        Task<EnderecoTotal> Inserir(EnderecoTotal enderecoTotal);
        Task<IEnumerable<MaterialRede>> ListarCarregarId(int? id_MaterialRede);
        Task<IEnumerable<EnderecoTotal>> Listar(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, PainelGanho painelGanho, Paginacao paginacao, int pageOff);
        Task<IEnumerable<EnderecoTotalDropFilter>> ListaUnica();
        Task<IEnumerable<LocalidadeDropFilter>> ListaUnicaLocalidade(FiltroEnderecoTotal filtro);
        Task<IEnumerable<GraficoPrincipalView>> GraficoPrincipal();
        Task<int> ChaveEstrangeira(string uf, string sigla, string cdo);
        Task<int> SurveyExistMultiplaAssociacao(BaseMultiplaAssociacao value);
        Task<bool> IgnoreKeyMultiplaAssociacao(
            BaseMultiplaAssociacao value
        );
        Task<EnderecoTotal> SurveyExistEnderecoTotal(string survey);
        Task<bool> IgnoreKeyEnderecoTotal(     
            BaseEnderecoTotal value, string anoMes

        );
    }
}
