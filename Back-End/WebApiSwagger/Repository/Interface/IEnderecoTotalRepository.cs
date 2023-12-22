using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository.Interface
{
    public interface IEnderecoTotalRepository
    {
        Task<EnderecoTotal> CarregarId(int? id_MaterialRede);
        Task<IEnumerable<EnderecoTotal>> ListarCarregarId(int? id_MaterialRede);
        Task<IEnumerable<EnderecoTotal>> Listar(FiltroEnderecoTotal filtro, Paginacao paginacao);
        Task<IEnumerable<EnderecoTotal>> BaseAcumulada(FiltroEnderecoTotal filtro, Paginacao paginacao);
        Task<IEnumerable<EnderecoTotal>> ListarGanho(FiltroEnderecoTotal filtro, Paginacao paginacao, PainelGanho painelGanho);
        //Task<IEnumerable<EnderecoTotal>> ListarGanhoDia(FiltroEnderecoTotal filtro, Paginacao paginacao, PainelGanho painelGanho);
        Task<IEnumerable<EnderecoTotal>> ListaUnica();
    }
}
