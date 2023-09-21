using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public interface IUsuarioRepository
    {
        Task<Usuario> Inserir(Usuario Usuario);
        Task<Usuario> Editar(int id, Usuario Usuario);
        Task<bool> Deletar(int id);
        Task<Usuario> VerificarUsuario(string login);
        Task<Usuario> CarregarId(int id);
        Task<IEnumerable<Usuario>> Listar();
    }
}