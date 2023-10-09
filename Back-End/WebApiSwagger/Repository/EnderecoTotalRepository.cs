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

        public async Task<EnderecoTotal> CarregarId(FiltroEnderecoTotalAny filtro)
        {
            try
            {
                return await _context.EnderecosTotais
                           .Where(p => p.UF == filtro.UF && p.Estacao == filtro.Estacao && p.NomeCdo == filtro.CDO)
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
                        .AsQueryable();

                if (!string.IsNullOrEmpty(filtro.UF))
                {
                    query = query.Where(p => p.UF == filtro.UF);
                }

                if (!string.IsNullOrEmpty(filtro.Estacao))
                {
                    query = query.Where(p => p.Estacao == filtro.Estacao);
                }

                if (!string.IsNullOrEmpty(filtro.Municipio))
                {
                    query = query.Where(p => p.Municipio == filtro.Municipio);
                }

                if (!string.IsNullOrEmpty(filtro.CodSurvey))
                {
                    query = query.Where(p => p.Cod_Survey == filtro.CodSurvey);
                }

                if (!string.IsNullOrEmpty(filtro.CDO))
                {
                    query = query.Where(p => p.NomeCdo == filtro.CDO);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoOperacional))
                {
                    query = query.Where(p => p.EstadoOperacional == filtro.EstadoOperacional);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoControle))
                {
                    query = query.Where(p => p.EstadoControle == filtro.EstadoControle);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoProjeto))
                {
                    query = query.Where(p => p.EstadoProjeto == filtro.EstadoProjeto);
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
