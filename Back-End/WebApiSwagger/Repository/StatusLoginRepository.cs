using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository
{
    public class StatusLoginRepository : IStatusLoginRepository
    {
        private readonly AppDbContext _context;
        public StatusLoginRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<StatusLogin> CarregarId(int id)
        {
            try
            {
                return await _context.StatusLogins
                            .Where(p => p.Id_Usuario == id)
                            .FirstOrDefaultAsync() ?? new StatusLogin();    
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
        }

        public async Task<StatusLogin> Editar(int id, StatusLogin statusLogin)
        {
             try
            {
                StatusLogin db = await CarregarId(id);

                db.Id_StatusLogin = statusLogin.Id_StatusLogin;
                db.Status = statusLogin.Status;
                db.LoginDate = statusLogin.LoginDate;
                db.Id_Usuario = statusLogin.Id_Usuario;
                
                _context.StatusLogins.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.InnerException);
            }
        }

        public async Task<StatusLogin> Inserir(StatusLogin statusLogin)
        {
            try
            {
                _context.StatusLogins.Add(statusLogin);
                await _context.SaveChangesAsync();
                return statusLogin;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message + ", " + ex.InnerException?.Message);
            }
        }

    }
}
