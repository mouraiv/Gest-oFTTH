using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository
{
    public class EnderecoTotalRepository : IEnderecoTotalRepository
    {
        private readonly AppDbContext _context;
        public EnderecoTotalRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<EnderecoTotal> CarregarId(int id)
        {
            try
            {
                return await _context.EnderecosTotais
                      .Include(p => p.GetLigacao)
                           .Where(p => p.Id_EnderecoTotal == id)
                           .FirstOrDefaultAsync() ?? new EnderecoTotal(); 
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
            
        }
        public async Task<IEnumerable<EnderecoTotal>> Listar(FiltroEnderecoTotal filtro, Paginacao paginacao)
        {
              try
            {
                var query = _context.EnderecosTotais
                        .Include(p => p.GetLigacao)
                        .AsQueryable();

                if (!string.IsNullOrEmpty(filtro.UF))
                {
                    query = query.Where(p => p.UF == filtro.UF);
                }

                if (!string.IsNullOrEmpty(filtro.Unidade))
                {
                    query = query.Where(p => p.Unidade == filtro.Unidade);
                }

                if (!string.IsNullOrEmpty(filtro.Municipio))
                {
                    query = query.Where(p => p.Municipio == filtro.Municipio);
                }

                if (!string.IsNullOrEmpty(filtro.CodSurvey))
                {
                    query = query.Where(p => p.CodSurvey == filtro.CodSurvey);
                }

                if (!string.IsNullOrEmpty(filtro.CDO))
                {
                    query = query.Where(p => p.CDO == filtro.CDO);
                }

                if (filtro.Cabo != null)
                {
                    query = query.Where(p => p.GetLigacao.Cabo == filtro.Cabo);
                }

                if (!string.IsNullOrEmpty(filtro.Celula))
                {
                    query = query.Where(p => p.GetLigacao.Celula == filtro.Celula);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoOperacional))
                {
                    query = query.Where(p => p.GetLigacao.EstadoOperacional == filtro.EstadoOperacional);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoControle))
                {
                    query = query.Where(p => p.GetLigacao.EstadoControle == filtro.EstadoControle);
                }
   
                paginacao.Total = await query.CountAsync();

                query = query
                    .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                    .Take(paginacao.Tamanho);

                return await query.ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
                          
        }
    }
}
