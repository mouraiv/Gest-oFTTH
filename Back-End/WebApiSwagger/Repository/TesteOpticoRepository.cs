using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;
using Microsoft.AspNetCore.Mvc;

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

                db.UF = testeOptico.UF;
                db.Construtora = testeOptico.Construtora;
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
                            .Include(p => p.EnderecosTotais)
                            .Include(p => p.Analises)
                            .ThenInclude(p => p.AnaliseCDOIAs)
                            .Where(p => p.Id_TesteOptico == id)
                            .FirstOrDefaultAsync() ?? new TesteOptico();    
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.InnerException);
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
       
        public async Task<IEnumerable<TesteOptico>> Listar(FiltroTesteOptico filtro, Paginacao paginacao)
        {
            try
            {
                var query = _context.TestesOpticos
                    .Include(p => p.Analises)
                    .ThenInclude(p => p.AnaliseCDOIAs)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(filtro.UF))
                {
                    query = query.Where(p => p.UF == filtro.UF);
                }

                if (!string.IsNullOrEmpty(filtro.Construtora))
                {
                    query = query.Where(p => p.Construtora == filtro.Construtora);
                }

                if (!string.IsNullOrEmpty(filtro.Estacao))
                {
                    query = query.Where(p => p.Estacao == filtro.Estacao);
                }

                if (!string.IsNullOrEmpty(filtro.CDO))
                {
                    query = query.Where(p => p.CDO == filtro.CDO);
                }

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

                paginacao.Total = await query.CountAsync();
            
                query = query
                    .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                    .Take(paginacao.Tamanho);

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao Listar: " + ex.Message);
            }
            
        }
        public async Task<List<string?>> ListaUnica([FromQuery]string coluna)
        {
            try
            {
                var propriedade = typeof(TesteOptico).GetProperty(coluna);

                if (propriedade == null)
                {
                    // A propriedade não existe na classe TesteOptico.
                    return new List<string?>();
                }

                var valores = await _context.TestesOpticos
                    .Select(x => propriedade.GetValue(x).ToString())
                    .ToListAsync();

                var valoresUnicos = valores
                    .GroupBy(x => x)
                    .Select(group => group.Key)
                    .ToList();

            return valoresUnicos;
            
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
           
        }

        public async Task<TesteOptico> Unique(string uf, string estacao, string cdo)
        {
            try
            {

                return await _context.TestesOpticos
                .Where(p => p.UF == uf && p.Estacao == estacao && p.CDO == cdo)
                .Select(p => new TesteOptico{
                    Id_TesteOptico = p.Id_TesteOptico,
                    UF = p.UF,
                    Estacao = p.Estacao,
                    CDO = p.CDO
                })
                .FirstOrDefaultAsync() ?? new TesteOptico();    
                            
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
        }

        public async Task<IEnumerable<TesteOptico>> ControlerCdo(FiltroTesteOptico filtro, Paginacao paginacao)
        {
             try
            {
                var query = _context.TestesOpticos
                    .Where(p => p.Sel > 0)
                    .AsQueryable();

                paginacao.Total = await query.CountAsync();
            
                query = query
                    .Skip((paginacao.Pagina - 1) * paginacao.Tamanho)
                    .Take(paginacao.Tamanho);

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao Listar: " + ex.Message);
            }
        }
    }
}