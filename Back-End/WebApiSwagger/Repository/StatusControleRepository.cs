using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class StatusControleRepository : IStatusControleRepository
    {
        private readonly AppDbContext _context;
        public StatusControleRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<StatusControle> CarregarId(int id)
        {
            try
            {
                return await _context.StatusControles
                           .Where(p => p.Id_StatusControle == id)
                           .FirstOrDefaultAsync() ?? new StatusControle(); 
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
                StatusControle db = await CarregarId(id);

                _context.StatusControles.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<StatusControle> Editar(int id, StatusControle StatusControle)
        {
            try
            {
                StatusControle db = await CarregarId(id);

                db.Nome = StatusControle.Nome;
                db.Email = StatusControle.Email;
                db.Id_Cargo = StatusControle.Id_Cargo;
                db.Id_Empresa = StatusControle.Id_Empresa;
            
                _context.StatusControles.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<StatusControle> Inserir(StatusControle StatusControle)
        {
            try
            {
                _context.StatusControles.Add(StatusControle);
                await _context.SaveChangesAsync();
                return StatusControle;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<StatusControle>> Listar()
        {
             try
            {
                return await _context.StatusControles
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}