using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IValidacaoRepository
    {
        Task<Validacao> Inserir(Validacao Validacao);
        Task<Validacao> Editar(int id, Validacao Validacao);
        Task<bool> Deletar(int id);
        Task<Validacao> VerificarValidacao(int id);
        Task<Validacao> CarregarId(int id);
        Task<IEnumerable<Validacao>> Listar();
    }
}