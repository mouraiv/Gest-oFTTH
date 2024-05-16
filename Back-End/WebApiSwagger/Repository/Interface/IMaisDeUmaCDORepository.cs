using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository.Interface
{
    public interface IMaisDeUmaCDORepository
    {
        Task<MaisDeUmaCDO> CarregarId(int? id_MaisDeUmaCDO);
        Task<bool> Deletar(int id);
        Task<MaisDeUmaCDO> Editar(int id, MaisDeUmaCDO maisDeUmaCDO);
        Task<MaisDeUmaCDO> Inserir(MaisDeUmaCDO maisDeUmaCDO);
        Task<IEnumerable<MaisDeUmaCDO>> Listar();
        Task<int> SurveyExist(string associacao, string survey, string data);
        Task<bool> IgnoreKey(
            string uf,
            string estacao_Mc,
            string survey_Mc,
            string associacao_CDO,
            string data_de_associacao
        );
    }
}
