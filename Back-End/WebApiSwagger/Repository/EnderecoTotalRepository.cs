using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Repository
{
    public class EnderecoTotalRepository : IEnderecoTotalRepository
    {
        private readonly AppDbContext _context;
        public EnderecoTotalRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<EnderecoTotal> CarregarId(int? id_EnderecoTotal)
        {
            try
            {
                return await _context.EnderecosTotais
                           .Where(p => p.Id_EnderecoTotal == id_EnderecoTotal)
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
                    .Include(p => p.MaterialRede)
                    .Select(et => new EnderecoTotal {
                        Id_EnderecoTotal = et.Id_EnderecoTotal,
                        Id_MaterialRede = et.Id_MaterialRede,
                        UF = et.UF,
                        Localidade = et.Localidade,
                        Municipio = et.Municipio,
                        SiglaEstacao = et.SiglaEstacao,
                        Celula = et.Celula,
                        NomeCdo = et.NomeCdo,
                        Cod_Survey = et.Cod_Survey,
                        QuantidadeUMS = et.QuantidadeUMS,
                        Cod_Viabilidade = et.Cod_Viabilidade,
                        TipoViabilidade = et.TipoViabilidade,
                        TipoRede = et.TipoRede,
                        UCS_Residenciais = et.UCS_Residenciais,
                        UCS_Comerciais = et.UCS_Comerciais,
                        MaterialRede = et.MaterialRede
                    })
                    .AsQueryable();

                if (!string.IsNullOrEmpty(filtro.UF))
                {
                    query = query.Where(p => p.UF == filtro.UF);
                }

                if (!string.IsNullOrEmpty(filtro.Estacao))
                {
                    query = query.Where(p => p.MaterialRede.NomeAbastecedora_Mt == filtro.Estacao);
                }

                if (!string.IsNullOrEmpty(filtro.Localidade))
                {
                    query = query.Where(p => p.Localidade == filtro.Localidade);
                }

                if (!string.IsNullOrEmpty(filtro.CodSurvey))
                {
                    query = query.Where(p => p.Cod_Survey == filtro.CodSurvey);
                }

                if (!string.IsNullOrEmpty(filtro.CDO))
                {
                    query = query.Where(p => p.NomeCdo == filtro.CDO);
                }

                if (!string.IsNullOrEmpty(filtro.Cod_Viabilidade))
                {
                    query = query.Where(p => p.Cod_Viabilidade == filtro.Cod_Viabilidade);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoOperacional))
                {
                    query = query.Where(p => p.MaterialRede.EstadoOperacional_Mt == filtro.EstadoOperacional);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoControle))
                {
                    query = query.Where(p => p.MaterialRede.EstadoControle_Mt == filtro.EstadoControle);
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

        public async Task<IEnumerable<EnderecoTotal>> ListarCarregarId(int? id_MaterialRede)
        {
            try
            {
                return await _context.EnderecosTotais
                .Where(p => p.Id_MaterialRede == id_MaterialRede)
                .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }

        public Task<List<string?>> ListaUnica([FromQuery]string coluna)
        {
            try
            {
                var propriedade = typeof(TesteOptico).GetProperty(coluna);

                if (propriedade == null)
                {
                    // A propriedade não existe na classe TesteOptico.
                    return Task.FromResult(new List<string?>());
                } 

                var valores = _context.EnderecosTotais
                    .Include(p => p.MaterialRede)
                    .AsEnumerable()
                    .Where(x => propriedade.GetValue(x) != null)
                    .Select(x => propriedade.GetValue(x)!.ToString())
                    .ToList();

                var valoresUnicos = valores
                    .GroupBy(x => x)
                    .Select(group => group.Key)
                    .ToList();

            return Task.FromResult(valoresUnicos);
            
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
           
        }
    }
}
