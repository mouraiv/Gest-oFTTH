using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class AnaliseCDOIARepository : IAnaliseCDOIARepository
    {
        private readonly AppDbContext _context;
        public AnaliseCDOIARepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<AnaliseCDOIA> CarregarId(int id)
        {
            try
            {
                return await _context.AnaliseCDOIAs
                           .Where(p => p.Id_AnaliseCDOIA == id)
                           .FirstOrDefaultAsync() ?? new AnaliseCDOIA(); 
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
                AnaliseCDOIA db = await CarregarId(id);

                _context.AnaliseCDOIAs.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<AnaliseCDOIA> Editar(int id, AnaliseCDOIA AnaliseCDOIA)
        {
            try
            {
                AnaliseCDOIA db = await CarregarId(id);

                db.CDOIA = AnaliseCDOIA.CDOIA;
                db.CDOIAStatus = AnaliseCDOIA.CDOIAStatus;
                db.CDOIAObservacao = AnaliseCDOIA.CDOIAObservacao;
            
                _context.AnaliseCDOIAs.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<AnaliseCDOIA> Inserir(AnaliseCDOIA AnaliseCDOIA)
        {
            try
            {
                _context.AnaliseCDOIAs.Add(AnaliseCDOIA);
                await _context.SaveChangesAsync();
                return AnaliseCDOIA;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<AnaliseCDOIA>> Listar()
        {
             try
            {
                return await _context.AnaliseCDOIAs
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}