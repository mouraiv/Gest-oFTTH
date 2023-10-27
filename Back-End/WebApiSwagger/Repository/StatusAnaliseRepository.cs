using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public class StatusAnaliseRepository : IStatusAnaliseRepository
    {
        private readonly AppDbContext _context;
        public StatusAnaliseRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<StatusAnalise> CarregarId(int id)
        {
            try
            {
                return await _context.StatusAnalises
                           .Where(p => p.Id_StatusAnalise == id)
                           .FirstOrDefaultAsync() ?? new StatusAnalise(); 
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
                StatusAnalise db = await CarregarId(id);

                _context.StatusAnalises.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<StatusAnalise> Editar(int id, StatusAnalise StatusAnalise)
        {
            try
            {
                StatusAnalise db = await CarregarId(id);

                db.Nome= StatusAnalise.Nome;
            
                _context.StatusAnalises.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.InnerException);
            }
        }

        public async Task<StatusAnalise> Inserir(StatusAnalise StatusAnalise)
        {
            try
            {
                _context.StatusAnalises.Add(StatusAnalise);
                await _context.SaveChangesAsync();
                return StatusAnalise;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<StatusAnalise>> Listar()
        {
             try
            {
                return await _context.StatusAnalises
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }

    }
}