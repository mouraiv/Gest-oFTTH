using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository.Interface
{
    public interface IEnderecoTotalRepository
    {
        Task<EnderecoTotal> CarregarId(int? id_MaterialRede, string? survey, bool filterSurvey);
        Task<EnderecoTotal> CarregarEnderecoTotalId(int? id_EnderecoTotal);
        Task<bool> Deletar(int id);
        Task<EnderecoTotal> Editar(int id, EnderecoTotal enderecoTotal);
        Task<EnderecoTotal> Inserir(EnderecoTotal enderecoTotal);
        Task<IEnumerable<EnderecoTotal>> ListarCarregarId(int? id_MaterialRede);
        Task<IEnumerable<EnderecoTotal>> Listar(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, PainelGanho painelGanho, Paginacao paginacao, int pageOff);
        Task<IEnumerable<EnderecoTotal>> BaseAcumulada(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, Paginacao paginacao);
        Task<IEnumerable<EnderecoTotal>> ListarGanho(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, Paginacao paginacao, PainelGanho painelGanho);
        Task<IEnumerable<EnderecoTotalDropFilter>> ListaUnica();
        Task<IEnumerable<LocalidadeDropFilter>> ListaUnicaLocalidade(FiltroEnderecoTotal filtro);
        Task<IEnumerable<GraficoPrincipalView>> GraficoPrincipal();
        Task<int> ChaveEstrangeira(string survey);
        Task<int> SurveyExistMultiplaAssociacao(string associacao, string survey, string cdo, string data);
        Task<bool> IgnoreKeyMultiplaAssociacao(
            string uf,
            string estacao_Mc,
            string nomeCDO,
            string survey_Mc,
            string associacao_CDO,
            string data_de_associacao
        );
        Task<int> SurveyExistEnderecoTotal(string survey, string CDO);
        Task<bool> IgnoreKeyEnderecoTotal(
            string anoMes,     
            string uf,
            string logradouro,
            string numeroFachada,
            string bairro,
            string CEP,
            string siglaEstacao,
            string nomeCDO,
            string cod_Survey,
            int quantidadeUMS,
            string cod_Viabilidade,
            string tipoViabilidade,
            string tipoRede,
            string disp_Comercial,
            string UCS_Residenciais,
            string UCS_Comerciais

        );
    }
}
