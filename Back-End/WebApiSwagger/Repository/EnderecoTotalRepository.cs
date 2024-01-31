using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Models.ViewModel;
using System.Linq;

namespace WebApiSwagger.Repository
{
    public class EnderecoTotalRepository : IEnderecoTotalRepository
    {
        private readonly AppDbContext _context;
        public EnderecoTotalRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EnderecoTotal>> BaseAcumulada(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, Paginacao paginacao)
        {
            try
            {
                progressoRepository.UpdateProgress(true, 10, "Iniciando consulta...", 100);
                await Task.Delay(500);

                var query = _context.EnderecosTotais
                    .Include(p => p.MaterialRede)
                    .Where(p => p.Id_StatusGanho == 1)
                    .Select(et => new EnderecoTotal {
                        Id_EnderecoTotal = et.Id_EnderecoTotal,
                        Id_MaterialRede = et.Id_MaterialRede,
                        AnoMes = et.AnoMes,
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

                    progressoRepository.UpdateProgress(true, 35, "Verificando filtros...", 100);
                    await Task.Delay(500);

                    if (!string.IsNullOrEmpty(filtro.AnoMes))
                    {
                        query = query.Where(p => p.AnoMes == filtro.AnoMes);
                    }

                    if (!string.IsNullOrEmpty(filtro.UF))
                    {
                        query = query.Where(p => p.UF == filtro.UF);
                    }

                    if (!string.IsNullOrEmpty(filtro.SiglaEstacao))
                    {
                        query = query.Where(p => p.SiglaEstacao == filtro.SiglaEstacao);
                    }

                    if (!string.IsNullOrEmpty(filtro.Estacao))
                    {
                        query = query.Where(p => p.MaterialRede.NomeAbastecedora_Mt == filtro.Estacao);
                    }

                    if (!string.IsNullOrEmpty(filtro.Localidade))
                    {
                        query = query.Where(p => p.Localidade == filtro.Localidade);
                    }

                    progressoRepository.UpdateProgress(true, 50, "Carregando consulta...", 100);
                    await Task.Delay(500);

                    if (filtro.Cod_Survey != null && filtro.Cod_Survey.Any())
                    {
                        query = query.Where(p => filtro.Cod_Survey.Contains(p.Cod_Survey));
                    }

                    if (!string.IsNullOrEmpty(filtro.CDO))
                    {
                        query = query.Where(p => p.NomeCdo == filtro.CDO);
                    }

                    if (!string.IsNullOrEmpty(filtro.Cod_Viabilidade))
                    {
                        query = query.Where(p => p.Cod_Viabilidade == filtro.Cod_Viabilidade);
                    }

                    if (!string.IsNullOrEmpty(filtro.GrupoOperacional))
                    {
                        query = query.Where(p => p.MaterialRede.GrupoOperacional_Mt == filtro.GrupoOperacional);
                    }

                    if (!string.IsNullOrEmpty(filtro.EstadoOperacional))
                    {
                        query = query.Where(p => p.MaterialRede.EstadoOperacional_Mt == filtro.EstadoOperacional);
                    }

                    if (!string.IsNullOrEmpty(filtro.EstadoControle))
                    {
                        query = query.Where(p => p.MaterialRede.EstadoControle_Mt == filtro.EstadoControle);
                    }

                    // Aplica a ordenação
                    query = query.OrderBy(p => p.Cod_Viabilidade);

                    paginacao.Total = await query.CountAsync();

                    query = query
                        .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                        .Take(paginacao.Tamanho);

                    progressoRepository.UpdateProgress(true, 85, "Preenchendo Lista...", 100);
                    await Task.Delay(500);    

                    return await query.ToListAsync();             
                }
                catch (Exception ex)
                {  
                    throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
                }
                finally 
                {
                    progressoRepository.UpdateProgress(true, 100, "Finalizando...", 100);
                    await Task.Delay(1000);
                }
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
        public async Task<IEnumerable<EnderecoTotal>> Listar(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, Paginacao paginacao, int pageOff)
        {
              try
            {
                
                var _cod_Survey = filtro.Cod_Survey?.Split(',');
                var _chave = filtro.CHAVE?.Split(',');

                progressoRepository.UpdateProgress(true, 10, "Iniciando consulta...", 100);
                await Task.Delay(500);

                var query = _context.EnderecosTotais
                    .Include(p => p.MaterialRede)
                    .Select(et => new EnderecoTotal {
                        Id_EnderecoTotal = et.Id_EnderecoTotal,
                        Id_MaterialRede = et.Id_MaterialRede,
                        Id_Disponibilidade = et.Id_Disponibilidade,
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
                        Disp_Comercial = et.Disp_Comercial,
                        UCS_Residenciais = et.UCS_Residenciais,
                        UCS_Comerciais = et.UCS_Comerciais,
                        MaterialRede = et.MaterialRede
                    })
                    .AsQueryable();

                progressoRepository.UpdateProgress(true, 35, "Verificando filtros...", 100);
                await Task.Delay(500);

                if (!string.IsNullOrEmpty(filtro.UF))
                {
                    query = query.Where(p => p.UF == filtro.UF);
                }

                if (filtro.Id_Disponibilidade != null)
                {
                    query = query.Where(p => p.Id_Disponibilidade == filtro.Id_Disponibilidade);
                }

                if (!string.IsNullOrEmpty(filtro.SiglaEstacao))
                {
                    query = query.Where(p => p.SiglaEstacao == filtro.SiglaEstacao);
                }

                if (!string.IsNullOrEmpty(filtro.Estacao))
                {
                    query = query.Where(p => p.MaterialRede.NomeAbastecedora_Mt == filtro.Estacao);
                }

                if (!string.IsNullOrEmpty(filtro.Localidade))
                {
                    query = query.Where(p => p.Localidade == filtro.Localidade);
                }

                if (!string.IsNullOrEmpty(filtro.CDO))
                {
                    query = query.Where(p => p.NomeCdo == filtro.CDO);
                }

                progressoRepository.UpdateProgress(true, 50, "Carregando consulta...", 100);
                await Task.Delay(500);

                if (!string.IsNullOrEmpty(filtro.Cod_Viabilidade))
                {
                    query = query.Where(p => p.Cod_Viabilidade == filtro.Cod_Viabilidade);
                }

                 if (!string.IsNullOrEmpty(filtro.GrupoOperacional))
                {
                    query = query.Where(p => p.MaterialRede.GrupoOperacional_Mt == filtro.GrupoOperacional);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoOperacional))
                {
                    query = query.Where(p => p.MaterialRede.EstadoOperacional_Mt == filtro.EstadoOperacional);
                }

                if (!string.IsNullOrEmpty(filtro.EstadoControle))
                {
                    query = query.Where(p => p.MaterialRede.EstadoControle_Mt == filtro.EstadoControle);
                }

                if (!string.IsNullOrEmpty(filtro.Cod_Survey) && _cod_Survey.Any())
                {

                    progressoRepository.UpdateProgress(true, 75, "Carregando surveys...", 100);
                    await Task.Delay(500);
                    
                    query = query.Where(p => _cod_Survey.Contains(p.Cod_Survey));

                    query = query.OrderBy(p => p.Cod_Viabilidade);

                    progressoRepository.UpdateProgress(true, 90, "Preenchendo Lista... ", 100);

                    paginacao.PaginasCorrentes = filtro.TotalSurveyList;

                    paginacao.Tamanho = filtro.TotalSurveyList; 

                    paginacao.Total = filtro.TotalSurveyList;

                    return await query.ToListAsync();    

                } 
                else if(!string.IsNullOrEmpty(filtro.CHAVE) && _chave.Any())
                {
                    progressoRepository.UpdateProgress(true, 75, "Carregando chaves CDOEs...", 100);
                    await Task.Delay(500);

                    query = query.Where(p => _chave.Contains(p.MaterialRede.CHAVE));

                    query = query.OrderBy(p => p.Cod_Viabilidade);

                    progressoRepository.UpdateProgress(true, 90, "Preenchendo Lista... ", 100); 

                    var _registros = await query.CountAsync();

                    paginacao.PaginasCorrentes = _registros;

                    paginacao.Tamanho = _registros;

                    paginacao.Total = _registros;

                    return await query.ToListAsync();
        
                }
                else
                {
                    query = query.OrderBy(p => p.Cod_Viabilidade);

                    progressoRepository.UpdateProgress(true, 85, "Preenchendo Lista...", 100);        

                    var _registros = await query.CountAsync();

                    paginacao.Total = _registros;
                    
                    if(pageOff == 1){   
                        query = query
                            .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                            .Take(paginacao.Tamanho);

                    return await query.ToListAsync(); 

                    }else{
                        if(_registros <= 1000000){
                            progressoRepository.UpdateProgress(true, 85, "Preenchendo Lista... ", 100);
                            await Task.Delay(500);

                            return await query.ToListAsync();

                        }else{
                            throw new Exception("O filtro não pode exceder 1.000.000 de registros para exportação.");
                            
                        }  
                    }

                }
                

            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
            finally
            {
                progressoRepository.UpdateProgress(false, 100, "Finalizando...", 100);
                await Task.Delay(1000);
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

        public async Task<IEnumerable<EnderecoTotal>> ListarGanho(IProgressoRepository progressoRepository,FiltroEnderecoTotal filtro, Paginacao paginacao,PainelGanho painelGanho)
        {
            try
            {
                progressoRepository.UpdateProgress(true, 10, "Iniciando consulta...", 100);
                await Task.Delay(500);

                var query = _context.EnderecosTotais
                .Include(p => p.MaterialRede)
                    .Select(et => new EnderecoTotal {
                        Id_EnderecoTotal = et.Id_EnderecoTotal,
                        Id_MaterialRede = et.Id_MaterialRede,
                        StatusGanho = et.StatusGanho,
                        Id_StatusGanho = et.Id_StatusGanho,
                        Disponibilidade = et.Disponibilidade,
                        Id_Disponibilidade = et.Id_Disponibilidade,
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
                        MaterialRede = et.MaterialRede
                    })
                    .AsQueryable();

                    progressoRepository.UpdateProgress(true, 35, "Verificando filtros...", 100);
                    await Task.Delay(500);

                    if (filtro != null)
                    {

                    if (filtro.Id_StatusGanho != null)
                    {
                        query = query.Where(p => p.Id_StatusGanho == filtro.Id_StatusGanho);
                    }

                    if (filtro.Id_Disponibilidade != null)
                    {
                        query = query.Where(p => p.Id_Disponibilidade == filtro.Id_Disponibilidade);
                    }

                    if (!string.IsNullOrEmpty(filtro.UF))
                    {
                        query = query.Where(p => p.UF == filtro.UF);
                    }

                    if (!string.IsNullOrEmpty(filtro.SiglaEstacao))
                    {
                        query = query.Where(p => p.SiglaEstacao == filtro.SiglaEstacao);
                    }

                    if (!string.IsNullOrEmpty(filtro.Estacao))
                    {
                        query = query.Where(p => p.MaterialRede.NomeAbastecedora_Mt == filtro.Estacao);
                    }

                    progressoRepository.UpdateProgress(true, 50, "Carregando consulta...", 100);
                     await Task.Delay(500);

                    if (!string.IsNullOrEmpty(filtro.Localidade))
                    {
                        query = query.Where(p => p.Localidade == filtro.Localidade);
                    }

                    if (!string.IsNullOrEmpty(filtro.Cod_Survey))
                    {
                        query = query.Where(p => p.Cod_Survey == filtro.Cod_Survey);
                    }

                    if (!string.IsNullOrEmpty(filtro.CDO))
                    {
                        query = query.Where(p => p.NomeCdo == filtro.CDO);
                    }

                    if (!string.IsNullOrEmpty(filtro.Cod_Viabilidade))
                    {
                        query = query.Where(p => p.Cod_Viabilidade == filtro.Cod_Viabilidade);
                    }

                    }

                    progressoRepository.UpdateProgress(true, 75, "Calculando Ganho...", 100);

                        paginacao.Total = await query.CountAsync();

                        if(filtro?.Pagina == 1) {    

                        painelGanho.ComGanhoTotal = query.Where(p => p.Id_StatusGanho == 1).Sum(p => p.QuantidadeUMS) ?? 0;
                        painelGanho.ComGanhoAtivo = query.Where(p => p.Id_StatusGanho == 1 && p.Id_Disponibilidade == 1).Sum(p => p.QuantidadeUMS) ?? 0;
                        painelGanho.ComGanhoInativo =  query.Where(p => p.Id_StatusGanho == 1 && p.Id_Disponibilidade == 2).Sum(p => p.QuantidadeUMS) ?? 0;
                        painelGanho.ComGanhoForaCelula = query.Where(p => p.Id_StatusGanho == 1 && p.Id_Disponibilidade == 3).Sum(p => p.QuantidadeUMS) ?? 0;

                        painelGanho.SemGanhoTotal = query.Where(p => p.Id_StatusGanho == 2).Sum(p => p.QuantidadeUMS) ?? 0;
                        painelGanho.SemGanhoAtivo = query.Where(p => p.Id_StatusGanho == 2 && p.Id_Disponibilidade == 1).Sum(p => p.QuantidadeUMS) ?? 0;
                        painelGanho.SemGanhoInativo = query.Where(p => p.Id_StatusGanho == 2 && p.Id_Disponibilidade == 2).Sum(p => p.QuantidadeUMS) ?? 0;
                        painelGanho.SemGanhoForaCelula = query.Where(p => p.Id_StatusGanho == 2 && p.Id_Disponibilidade == 3).Sum(p => p.QuantidadeUMS) ?? 0;
                        
                        }

                        query = query.OrderBy(p => p.Cod_Viabilidade)
                        .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                        .Take(paginacao.Tamanho);

                        progressoRepository.UpdateProgress(true, 85, "Prrenchendo lista...", 100);

                        return await query.ToListAsync();   

                }
                catch (Exception ex)
                {  
                    throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
                }
                finally
                {
                    progressoRepository.UpdateProgress(false, 100, "Finalizando...", 100);
                    await Task.Delay(1000);
                }
        }

        /*public async Task<IEnumerable<EnderecoTotal>> ListarGanhoDia(FiltroEnderecoTotal filtro, Paginacao paginacao, PainelGanho painelGanho)
        {
            try
            {
                var query = _context.EnderecosTotais
                .Where(p => p.QuantidadeUMS_ganhoDia != null)
                .Include(p => p.MaterialRede)
                    .Select(et => new EnderecoTotal {
                        Id_EnderecoTotal = et.Id_EnderecoTotal,
                        Id_MaterialRede = et.Id_MaterialRede,
                        StatusGanhoDia = et.StatusGanhoDia,
                        Id_StatusGanhoDia = et.Id_StatusGanhoDia,
                        Disponibilidade = et.Disponibilidade,
                        Id_Disponibilidade = et.Id_Disponibilidade,
                        UF = et.UF,
                        Localidade = et.Localidade,
                        Municipio = et.Municipio,
                        SiglaEstacao = et.SiglaEstacao,
                        Celula = et.Celula,
                        NomeCdo = et.NomeCdo,
                        Cod_Survey = et.Cod_Survey,
                        QuantidadeUMS = et.QuantidadeUMS,
                        QuantidadeUMS_old = et.QuantidadeUMS_old,
                        QuantidadeUMS_ganhoDia = et.QuantidadeUMS_ganhoDia,
                        Cod_Viabilidade = et.Cod_Viabilidade,
                        TipoViabilidade = et.TipoViabilidade,
                        MaterialRede = et.MaterialRede
                    })
                    .AsQueryable();

                    if (filtro.Id_StatusGanhoDia != null)
                    {
                        query = query.Where(p => p.Id_StatusGanhoDia == filtro.Id_StatusGanhoDia);
                    }

                    if (filtro.Id_Disponibilidade != null)
                    {
                        query = query.Where(p => p.Id_Disponibilidade == filtro.Id_Disponibilidade);
                    }

                    if (!string.IsNullOrEmpty(filtro.UF))
                    {
                        query = query.Where(p => p.UF == filtro.UF);
                    }

                    if (!string.IsNullOrEmpty(filtro.SiglaEstacao))
                    {
                        query = query.Where(p => p.SiglaEstacao == filtro.SiglaEstacao);
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

                    paginacao.Total = query.Count();

                    if(filtro != null && typeof(FiltroEnderecoTotal).GetProperties().Where(prop => prop.Name != "Pagina").Any(prop => prop.GetValue(filtro) != null)) {    
                        var _query = await query.ToListAsync();

                        painelGanho.ComGanhoTotal = _query.Where(p => p.Id_StatusGanhoDia == 1).Sum(p => p.QuantidadeUMS_ganhoDia) ?? 0;
                        painelGanho.ComGanhoAtivo = _query.Where(p => p.Id_StatusGanhoDia == 1 && p.Id_Disponibilidade == 1).Sum(p => p.QuantidadeUMS_ganhoDia) ?? 0;
                        painelGanho.ComGanhoInativo =  _query.Where(p => p.Id_StatusGanhoDia == 1 && p.Id_Disponibilidade == 2).Sum(p => p.QuantidadeUMS_ganhoDia) ?? 0;
                        painelGanho.ComGanhoForaCelula = _query.Where(p => p.Id_StatusGanhoDia == 1 && p.Id_Disponibilidade == 3).Sum(p => p.QuantidadeUMS_ganhoDia) ?? 0;

                        painelGanho.SemGanhoTotal = _query.Where(p => p.Id_StatusGanhoDia == 2).Sum(p => p.QuantidadeUMS_ganhoDia) ?? 0;
                        painelGanho.SemGanhoAtivo = _query.Where(p => p.Id_StatusGanhoDia == 2 && p.Id_Disponibilidade == 1).Sum(p => p.QuantidadeUMS_ganhoDia) ?? 0;
                        painelGanho.SemGanhoInativo = _query.Where(p => p.Id_StatusGanhoDia == 2 && p.Id_Disponibilidade == 2).Sum(p => p.QuantidadeUMS_ganhoDia) ?? 0;
                        painelGanho.SemGanhoForaCelula = _query.Where(p => p.Id_StatusGanhoDia == 2 && p.Id_Disponibilidade == 3).Sum(p => p.QuantidadeUMS_ganhoDia) ?? 0;

                        _query = _query
                        .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                        .Take(paginacao.Tamanho).ToList();

                        return _query;       

                    } else {
                        var soma = _context.ViewStatusGanhosDias.ToList();

                        painelGanho.ComGanhoTotal = soma.FirstOrDefault(r => r.Id_StatusGanhoDia == 1 && r.Id_Disponibilidade == 0)?.TotalPorStatus ?? 0;
                        painelGanho.ComGanhoAtivo = soma.FirstOrDefault(p => p.Id_StatusGanhoDia == 1 && p.Id_Disponibilidade == 1)?.TotalPorStatus ?? 0;
                        painelGanho.ComGanhoInativo =  soma.FirstOrDefault(p => p.Id_StatusGanhoDia == 1 && p.Id_Disponibilidade == 2)?.TotalPorStatus ?? 0;
                        painelGanho.ComGanhoForaCelula = soma.FirstOrDefault(p => p.Id_StatusGanhoDia == 1 && p.Id_Disponibilidade == 3)?.TotalPorStatus ?? 0;

                        painelGanho.SemGanhoTotal = soma.FirstOrDefault(p => p.Id_StatusGanhoDia == 2 && p.Id_Disponibilidade == 0)?.TotalPorStatus ?? 0;
                        painelGanho.SemGanhoAtivo = soma.FirstOrDefault(p => p.Id_StatusGanhoDia == 2 && p.Id_Disponibilidade == 1)?.TotalPorStatus ?? 0;
                        painelGanho.SemGanhoInativo = soma.FirstOrDefault(p => p.Id_StatusGanhoDia == 2 && p.Id_Disponibilidade == 2)?.TotalPorStatus ?? 0;
                        painelGanho.SemGanhoForaCelula = soma.FirstOrDefault(p => p.Id_StatusGanhoDia == 2 && p.Id_Disponibilidade == 3)?.TotalPorStatus ?? 0;

                        paginacao.Total = query.Count();

                        query = query
                            .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                            .Take(paginacao.Tamanho);

                        return await  query.ToListAsync(); 

                    }
                              
                }
                catch (Exception ex)
                {  
                    throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
                }
        }*/

        public async Task<IEnumerable<EnderecoTotal>> ListaUnica()
        {
            try
            {
                var query = await  _context.EnderecosTotais
                        .Select(p => new EnderecoTotal
                        { 
                            UF = p.UF,
                            Localidade = p.Localidade, 
                            SiglaEstacao = p.SiglaEstacao, 
                            Cod_Viabilidade = p.Cod_Viabilidade
                        })
                        .Distinct()
                        .ToListAsync();

                        return query;
            
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
           
        }
    }
}
