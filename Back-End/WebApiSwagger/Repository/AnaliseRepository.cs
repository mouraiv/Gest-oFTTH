using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class AnaliseRepository : IAnaliseRepository
    {
        private readonly AppDbContext _context;

        public AnaliseRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Analise> CarregarId(int id)
        {
            try
            {
                return await _context.Analises
                            .Include(p => p.GetTecnico)
                            .Where(p => p.Id_Analise == id)
                            .FirstOrDefaultAsync() ?? new Analise();    
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
                Analise db = await CarregarId(id);

                _context.Analises.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Analise> Editar(int id, Analise analise)
        {
             try
            {
                Analise db = await CarregarId(id);

                db.Id_TesteOptico = analise.Id_TesteOptico;
                db.Id_Tecnico = analise.Id_Tecnico;
                db.DataAnalise = analise.DataAnalise;
                db.Id_StatusAnalise = analise.Id_StatusAnalise;
                db.AnaliseObservacao = analise.AnaliseObservacao;
                db.CDOIA = analise.CDOIA;
                db.CDOIAStatus = analise.CDOIAStatus;
                db.CDOIAObs = analise.CDOIAObs;
                db.Id_Validacao = analise.Id_Validacao; 
                
                _context.Analises.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<Analise> Inserir(Analise analise)
        {
            try
            {
                _context.Analises.Add(analise);
                await _context.SaveChangesAsync();
                return analise;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message + ", " + ex.InnerException?.Message);
            }
        }
    }
}