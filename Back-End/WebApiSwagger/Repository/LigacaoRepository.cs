using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository
{
    public class LigacaoRepository : ILigacaoRepository
    {
        private readonly AppDbContext _context;
        public LigacaoRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<Ligacao> CarregarId(int? id_Ligacao)
        {
            try
            {
                return await _context.Ligacoes
                        .AsNoTracking()
                           .Where(p => p.Id_Ligacao == id_Ligacao)
                           .FirstOrDefaultAsync() ?? new Ligacao(); 
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
            
        }
        public async Task<IEnumerable<Ligacao>> ListarCarregarId(int? id_MaterialRede)
        {
            try
            {
                return await _context.Ligacoes
                .AsNoTracking()
                .Where(p => p.Id_MaterialRede == id_MaterialRede)
                .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}
