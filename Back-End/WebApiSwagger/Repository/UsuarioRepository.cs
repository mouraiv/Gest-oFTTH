using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;

namespace WebApiSwagger.Repository
{
    public class UsuarioRepository
    {
        private readonly AppDbContext _context;
        public UsuarioRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<Usuario> CarregarId(int id)
        {
            try
            {
                return await _context.Usuarios
                           .Where(p => p.Id_Usuario == id)
                           .FirstOrDefaultAsync() ?? new Usuario(); 
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
        }

        public async Task<bool> Deletar(int id)
        {
            try
            {
                Usuario db = await CarregarId(id);

                _context.Usuarios.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Usuario> Editar(int id, Usuario Usuario)
        {
            try
            {
                Usuario db = await CarregarId(id);

                db.Login = Usuario.Login;
                db.Senha = Usuario.Senha;
                db.Tipo = Usuario.Tipo;
                db.Publico = Usuario.Publico;
                db.Id_Tecnico = Usuario.Id_Tecnico;
            
                _context.Usuarios.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<Usuario> Inserir(Usuario Usuario)
        {
            try
            {
                _context.Usuarios.Add(Usuario);
                await _context.SaveChangesAsync();
                return Usuario;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<Usuario>> Listar()
        {
             try
            {
                return await _context.Usuarios
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}