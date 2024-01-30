using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;
using Microsoft.AspNetCore.Mvc;
using GroupDocs.Conversion.Contracts;

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
                            .ThenInclude(p => p.AnaliseCDOIAs)
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
                    .ThenInclude(p => p.AnaliseCDOIAs)
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
                    query = query.Where(p => p.CDO == filtro.CDO);
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
    }
}