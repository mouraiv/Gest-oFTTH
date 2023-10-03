using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class StatusProjetoRepository : IStatusProjetoRepository
    {
        private readonly AppDbContext _context;
        public StatusProjetoRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<StatusProjeto> CarregarId(int id)
        {
            try
            {
                return await _context.StatusProjetos
                           .Where(p => p.Id_StatusProjeto == id)
                           .FirstOrDefaultAsync() ?? new StatusProjeto(); 
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
                StatusProjeto db = await CarregarId(id);

                _context.StatusProjetos.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<StatusProjeto> Editar(int id, StatusProjeto StatusProjeto)
        {
            try
            {
                StatusProjeto db = await CarregarId(id);

                db.Nome = StatusProjeto.Nome;
                db.Email = StatusProjeto.Email;
                db.Id_Cargo = StatusProjeto.Id_Cargo;
                db.Id_Empresa = StatusProjeto.Id_Empresa;
            
                _context.StatusProjetos.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<StatusProjeto> Inserir(StatusProjeto StatusProjeto)
        {
            try
            {
                _context.StatusProjetos.Add(StatusProjeto);
                await _context.SaveChangesAsync();
                return StatusProjeto;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<StatusProjeto>> Listar()
        {
             try
            {
                return await _context.StatusProjetos
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}