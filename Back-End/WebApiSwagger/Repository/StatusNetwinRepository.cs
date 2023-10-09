using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class StatusNetwinRepository : IStatusNetwinRepository
    {
        private readonly AppDbContext _context;
        public StatusNetwinRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<StatusNetwin> CarregarId(int id)
        {
            try
            {
                return await _context.StatusNetwins
                           .Where(p => p.Id_StatusNetwin == id)
                           .FirstOrDefaultAsync() ?? new StatusNetwin(); 
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
                StatusNetwin db = await CarregarId(id);

                _context.StatusNetwins.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<StatusNetwin> Editar(int id, StatusNetwin StatusNetwin)
        {
            try
            {
                StatusNetwin db = await CarregarId(id);

                db.Codigo = StatusNetwin.Codigo;
                db.Tipo = StatusNetwin.Tipo;
                db.Descricao = StatusNetwin.Descricao;
            
                _context.StatusNetwins.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<StatusNetwin> Inserir(StatusNetwin StatusNetwin)
        {
            try
            {
                _context.StatusNetwins.Add(StatusNetwin);
                await _context.SaveChangesAsync();
                return StatusNetwin;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<StatusNetwin>> Listar()
        {
             try
            {
                return await _context.StatusNetwins
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}