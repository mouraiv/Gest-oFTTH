using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository
{
    public class TesteOpticoRepository : ITesteOpticoRepository
    {
        private readonly AppDbContext _context;
        public TesteOpticoRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<TesteOptico> Editar(int id, TesteOptico testeOptico)
        {
            try
            {
                TesteOptico db = await CarregarId(id);

                db.CHAVE = testeOptico.CHAVE;
                db.UF = testeOptico.UF;
                db.Construtora = testeOptico.Construtora;
                db.SiglaEstacao = testeOptico.SiglaEstacao;
                db.Estacao = testeOptico.Estacao;
                db.TipoObra = testeOptico.TipoObra;
                db.CDO = testeOptico.CDO;
                db.Cabo = testeOptico.Cabo;
                db.Celula = testeOptico.Celula;
                db.TotalUMs = testeOptico.TotalUMs;
                db.Endereco = testeOptico.Endereco;
                db.EstadoCampo = testeOptico.EstadoCampo;
                db.EstadoProjeto = testeOptico.EstadoProjeto;
                db.EstadoControle = testeOptico.EstadoControle;
                db.AceitacaoData = testeOptico.AceitacaoData;
                db.AceitacaoMesRef = testeOptico.AceitacaoMesRef;
                db.TesteObservacao = testeOptico.TesteObservacao;
                db.Meta = testeOptico.Meta;
                db.DataConstrucao = testeOptico.DataConstrucao;
                db.EquipeConstrucao = testeOptico.EquipeConstrucao;
                db.DataTeste = testeOptico.DataTeste;
                db.Tecnico = testeOptico.Tecnico;
                db.DataRecebimento = testeOptico.DataRecebimento;
                db.BobinaLancamento = testeOptico.BobinaLancamento;
                db.BobinaRecepcao = testeOptico.BobinaRecepcao;
                db.PosicaoIcxDgo = testeOptico.PosicaoIcxDgo;
                db.SplitterCEOS = testeOptico.SplitterCEOS;
                db.FibraDGO = testeOptico.FibraDGO;
                db.Sel = testeOptico.Sel;
                db.Id_MaterialRede = testeOptico.Id_MaterialRede;

                _context.TestesOpticos.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }

        }

        public async Task<TesteOptico> Inserir(TesteOptico testeOptico)
        {
            try
            {
                _context.TestesOpticos.Add(testeOptico);
                await _context.SaveChangesAsync();
                return testeOptico;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
            
        }

        public async Task<TesteOptico> CarregarId(int id)
        {
            try
            {
                return await _context.TestesOpticos
                        .Include(p => p.Analises)
                        .Include(p => p.AnaliseCDOIAs)
                        .Where(p => p.Id_TesteOptico == id)
                        .AsSplitQuery()
                        .FirstOrDefaultAsync() ?? new TesteOptico();
    
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
                TesteOptico db = await CarregarId(id);

                _context.TestesOpticos.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }
        public async Task<IEnumerable<ControleCampoViewModel>> ControleCampo(IProgressoRepository progressoRepository,FiltroTesteOptico filtro, Paginacao paginacao, int pageOff)
        {
            try
            {
                progressoRepository.UpdateProgress(true, 10, "Iniciando consulta...", 100);
                await Task.Delay(500);

                 var query = _context.TestesOpticos
                    .Where(p => p.Sel == 0)
                    .Select(p => new ControleCampoViewModel
                    {
                        CHAVE = p.CHAVE,
                        UF = p.UF,
                        SiglaEstacao = p.SiglaEstacao,
                        Estacao = p.Estacao,
                        TipoObra = p.TipoObra,
                        Cabo = p.Cabo,
                        Celula = p.Celula,
                        CDO = p.CDO,
                        Capacidade = p.Capacidade,
                        TotalUMs = p.TotalUMs,
                        Endereco = p.Endereco,
                        Construtora = p.Construtora,
                        EstadoProjeto = p.EstadoProjeto,
                        EstadoControle = p.EstadoControle,
                        DataRecebimento = p.DataRecebimento,
                        
                        Analises = p.Analises.Select(a => new ControleCampoViewModel.AnaliseViewModel
                        {
                            DataAnalise = a.DataAnalise,
                            Status = a.Status,
                            Analista = a.Analista,
                            AnaliseObservacao = a.AnaliseObservacao
                            
                        }),
                        MaterialRede = new ControleCampoViewModel.MaterialRedeViewModel
                        {
                            EstadoOperacional_Mt = p.MaterialRede.EstadoOperacional_Mt,
                            GrupoOperacional_Mt = p.MaterialRede.GrupoOperacional_Mt,
                            EstadoControle_Mt = p.MaterialRede.EstadoControle_Mt,
                            Endereco_Mt = p.MaterialRede.Endereco_Mt,
                            
                            EnderecoTotal = p.MaterialRede.EnderecoTotal.Select(e => new ControleCampoViewModel.EnderecoTotalViewModel
                            {
                                AnoMes = e.AnoMes,
                                TipoViabilidade = e.TipoViabilidade,
                                Cod_Viabilidade = e.Cod_Viabilidade
                            }),

                            Ligacao = p.MaterialRede.Ligacao.Select(l => new ControleCampoViewModel.LigacaoViewModel
                            {
                                DGO_ls = l.DGO_ls,
                                FibraDgo_ls = l.FibraDgo_ls,
                                PortaCdo_ls = l.PortaCdo_ls,
                                EstadoCicloVida_ls = l.EstadoCicloVida_ls
                                
                            })

                        }})
                        .AsQueryable();
                    
                progressoRepository.UpdateProgress(true, 35, "Verificando filtros...", 100);
                await Task.Delay(500);    

                if (!string.IsNullOrEmpty(filtro.UF))
                {
                    if (filtro.UF == "Nordeste")
                    {
                        var _nordeste = new [] {"MA", "PA", "RR", "AP", "MA", "PI", "CE", "RN", "PB", "PE", "AL", "SE", "BA"};
                        query = query.Where(p => _nordeste.Contains(p.UF));
                    }
                    else if (filtro.UF == "Centro-Oeste")
                    {
                        var _centroOeste = new [] {"AC", "RO", "TO", "MT", "MS", "GO", "DF"};
                        query = query.Where(p => _centroOeste.Contains(p.UF));
                    }
                    else if (filtro.UF == "Sudeste - (RJ)")
                    {
                        query = query.Where(p => p.UF == "RJ");
                    }
                     else if (filtro.UF == "Sudeste - (SP)")
                    {
                        query = query.Where(p => p.UF == "SP");
                    }
                     else if (filtro.UF == "Sudeste - (MG-ES)")
                    {
                        var _sudeste = new [] {"MG", "ES"};
                        query = query.Where(p => _sudeste.Contains(p.UF));
                    }
                    else if (filtro.UF == "Sul")
                    {
                        var _sul = new [] {"PR","SC","RS"};
                        query = query.Where(p => _sul.Contains(p.UF));
                    }
                    else
                    {
                        query = query.Where(p => p.UF == filtro.UF);
                    }    
                }

                if (!string.IsNullOrEmpty(filtro.Celula))
                {
                    query = query.Where(p => p.Celula == filtro.Celula);
                }

                if (!string.IsNullOrEmpty(filtro.Cabo))
                {
                    query = query.Where(p => p.Cabo == filtro.Cabo);
                }

                if (!string.IsNullOrEmpty(filtro.Estacao))
                {
                    query = query.Where(p => p.Estacao == filtro.Estacao);
                }

                if (!string.IsNullOrEmpty(filtro.SiglaEstacao))
                {
                    query = query.Where(p => p.SiglaEstacao == filtro.SiglaEstacao);
                }

                if (!string.IsNullOrEmpty(filtro.CDO))
                {
                    query = query.Where(p => p.CDO.Contains(filtro.CDO));
                }

                progressoRepository.UpdateProgress(true, 50, "Carregando consulta...", 100);
                await Task.Delay(500);

                if (!string.IsNullOrEmpty(filtro.DataRecebimento) && filtro.DataRecebimento.Length == 10)
                {
                    query = query.Where(p => p.DataRecebimento == DateTime.Parse(filtro.DataRecebimento));
                }

                // Aplica a ordenação
                query = query.OrderBy(p => p.Estacao).ThenBy(p => p.Celula).ThenBy(p => p.CDO);

                progressoRepository.UpdateProgress(true, 85, "Carregando consulta...", 100);

                var _registros = await query.CountAsync();

                paginacao.Total = _registros;

                if(pageOff == 1){   
                        query = query
                            .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                            .Take(paginacao.Tamanho);

                    progressoRepository.UpdateProgress(true, 95, "Preenchendo Lista...", 100);    

                    return await query.ToListAsync(); 

                }else{
                    if(_registros <= 1000000){
                        query = query
                            .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                            .Take(paginacao.Tamanho);

                        progressoRepository.UpdateProgress(true, 95, "Preenchendo Lista...", 100);

                        return await query.ToListAsync();

                    }else{
                        throw new Exception("O filtro não pode exceder 1.000.000 de registros para exportação.");
                            
                    }  
                }
            
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao Listar: " + ex.Message);
            }
            finally
            {
                if(pageOff == 1){   
                    progressoRepository.UpdateProgress(false, 100, "Finalizando...", 100);
                    await Task.Delay(1000);

                }else{
                    progressoRepository.UpdateProgress(false, 0, "Carregando dados...", 0);
                    await Task.Delay(1000);
                }
            }
            
        }
       
        public async Task<IEnumerable<TesteOptico>> Listar(IProgressoRepository progressoRepository,FiltroTesteOptico filtro, Paginacao paginacao)
        {
            try
            {
                progressoRepository.UpdateProgress(true, 10, "Iniciando consulta...", 100);
                await Task.Delay(500);

                var query = _context.TestesOpticos
                    .Where(p => p.Sel == 0)
                    .Include(p => p.Validacoes)
                    .Include(p => p.Analises)
                    .Include(p => p.AnaliseCDOIAs)
                    .AsQueryable();

                progressoRepository.UpdateProgress(true, 35, "Verificando filtros...", 100);
                await Task.Delay(500);    

                if (!string.IsNullOrEmpty(filtro.UF))
                {
                    query = query.Where(p => p.UF == filtro.UF);
                }

                if (!string.IsNullOrEmpty(filtro.Celula))
                {
                    query = query.Where(p => p.Celula == filtro.Celula);
                }

                if (!string.IsNullOrEmpty(filtro.Cabo))
                {
                    query = query.Where(p => p.Cabo == filtro.Cabo);
                }

                if (!string.IsNullOrEmpty(filtro.Estacao))
                {
                    query = query.Where(p => p.Estacao == filtro.Estacao);
                }

                if (!string.IsNullOrEmpty(filtro.SiglaEstacao))
                {
                    query = query.Where(p => p.SiglaEstacao == filtro.SiglaEstacao);
                }

                if (!string.IsNullOrEmpty(filtro.CDO))
                {
                    query = query.Where(p => p.CDO.Contains(filtro.CDO));
                }

                progressoRepository.UpdateProgress(true, 50, "Carregando consulta...", 100);
                await Task.Delay(500);

                if (!string.IsNullOrEmpty(filtro.DataTeste) && filtro.DataTeste.Length == 10)
                {
                    query = query.Where(p => p.DataTeste == DateTime.Parse(filtro.DataTeste));
                }

                if (!string.IsNullOrEmpty(filtro.DataConstrucao) && filtro.DataConstrucao.Length == 10)
                {
                    query = query.Where(p => p.DataConstrucao == DateTime.Parse(filtro.DataConstrucao));
                }

                if (!string.IsNullOrEmpty(filtro.DataRecebimento) && filtro.DataRecebimento.Length == 10)
                {
                    query = query.Where(p => p.DataRecebimento == DateTime.Parse(filtro.DataRecebimento));
                }

                // Aplica a ordenação
                query = query.OrderBy(p => p.Estacao).ThenBy(p => p.Celula).ThenBy(p => p.CDO);

                paginacao.Total = await query.CountAsync();
            
                query = query
                    .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                    .Take(paginacao.Tamanho);

                progressoRepository.UpdateProgress(true, 85, "Preenchendo Lista...", 100);    

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao Listar: " + ex.Message);
            }
            finally
            {
                progressoRepository.UpdateProgress(false, 100, "Finalizando...", 100);
                await Task.Delay(1000);
            }
            
        }
        public async Task<IEnumerable<TesteOptico>> ListaUnica()
        {
            try
            {
                var query = await  _context.TestesOpticos
                        .Select(p => new TesteOptico
                        { 
                            UF = p.UF, 
                            SiglaEstacao = p.SiglaEstacao, 
                            Estacao = p.Estacao,
                            Cabo = p.Cabo,
                            Celula = p.Celula,
                            Construtora= p.Construtora 
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

        public async Task<TesteOptico> Unique(string uf, string SiglaEstacao, string cdo)
        {
            try
            {

                return await _context.TestesOpticos
                .Where(p => p.UF == uf && p.SiglaEstacao == SiglaEstacao && p.CDO == cdo)
                .Select(p => new TesteOptico{
                    Id_TesteOptico = p.Id_TesteOptico,
                    UF = p.UF,
                    SiglaEstacao = p.SiglaEstacao,
                    CDO = p.CDO
                })
                .FirstOrDefaultAsync() ?? new TesteOptico();    
                            
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
        }

        public async Task<IEnumerable<TesteOptico>> ControlerCdo(IProgressoRepository progressoRepository, FiltroTesteOptico filtro, Paginacao paginacao)
        {
             try
            {
                progressoRepository.UpdateProgress(true, 10, "Iniciando consulta...", 100);
                await Task.Delay(500);

                var query = _context.TestesOpticos
                    .Where(p => p.Sel > 0)
                    .Include(p => p.Analises)
                    .AsQueryable();

                progressoRepository.UpdateProgress(true, 50, "Carregando consulta...", 100);
                await Task.Delay(500);    

                paginacao.Total = await query.CountAsync();
            
                query = query
                    .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                    .Take(paginacao.Tamanho);

                progressoRepository.UpdateProgress(true, 85, "Preenchendo Lista...", 100);    

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao Listar: " + ex.Message);
            }
            finally
            {
                progressoRepository.UpdateProgress(false, 100, "Finalizando...", 100);
                await Task.Delay(1000);
            }
        }

        public string ObterViabilidade(string viabCodigo)
        {
            switch (viabCodigo)
            {
                case "0":
                    return ("Viabilidade técnica confirmada");
                case "1":
                    return ("Este endereço não possui viabilidade técnica");
                case "2":
                    return ("Este endereço não possui viabilidade técnica");
                case "3":
                    return ("Este endereço não possui viabilidade técnica");
                case "4":
                    return ("Este endereço não possui viabilidade técnica");
                case "5":
                    return ("Este endereço não possui viabilidade técnica");
                case "6":
                    return ("Este endereço não possui viabilidade técnica");
                case "7":
                    return ("Este endereço não possui viabilidade técnica");
                case "8":
                    return ("Este endereço não possui viabilidade técnica");
                case "9":
                    return ("O apartamento ou sala dentro da edificação não foi encontrado. Confira se o endereço foi preenchido corretamente");
                case "10":
                    return ("Este endereço não possui viabilidade técnica por obstrução interna");
                case "11":
                    return ("Este endereço não possui viabilidade técnica");
                case "12":
                    return ("Este endereço não possui viabilidade técnica");
                case "13":
                    return ("Este endereço não possui viabilidade técnica");
                case "14":
                    return ("Este endereço não possui viabilidade técnica");
                case "15":
                    return ("Este endereço não possui viabilidade técnica");
                case "16":
                    return ("Este endereço não possui viabilidade técnica");
                case "17":
                    return ("Este endereço não possui viabilidade técnica");
                case "18":
                    return ("Este endereço não possui viabilidade técnica");
                case "19":
                    return ("Este endereço não possui viabilidade técnica");
                case "20":
                    return ("Em Análise - Viabilidade técnica Parcial. Solicitar construção etapa final de rede");
                case "21":
                    return ("Este endereço não possui viabilidade técnica");
                case "22":
                    return ("Este endereço não possui viabilidade técnica");
                case "23":
                    return ("Este endereço não possui viabilidade técnica");                                         
                default:
                    return ("-");
            }
        }
    }
}