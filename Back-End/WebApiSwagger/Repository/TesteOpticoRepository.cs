using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.EntityFrameworkCore;

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
                db.QuantidadeTeste = testeOptico.QuantidadeTeste;
                db.PosicaoIcxDgo = testeOptico.PosicaoIcxDgo;
                db.SplitterCEOS = testeOptico.SplitterCEOS;
                db.FibraDGO = testeOptico.FibraDGO;
                db.Id_Tecnico = testeOptico.Id_Tecnico;

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
                        .Include(p => p.GetTecnico)
                            .Where(p => p.Id_TesteOptico == id)
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
       
        public async Task<IEnumerable<TesteOptico>> Listar(FiltroTesteOptico filtro)
        {
            try
            {
                var query = _context.TestesOpticos
                    .Include(p => p.GetTecnico)
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

                if (filtro.Tecnico != null)
                {
                    query = query.Where(p => p.Id_Tecnico == filtro.Tecnico);
                }

                if (filtro.DataTeste != null)
                {
                    query = query.Where(p => p.DataTeste == filtro.DataTeste);
                }

                if (filtro.DataRecebimento != null)
                {
                    query = query.Where(p => p.DataRecebimento == filtro.DataRecebimento);
                }

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao Listar: " + ex.Message);
            }
            
        }
        public async Task<List<string?>> ListaUnica(string coluna)
        {
            try
            {
                var propriedade = typeof(TesteOptico).GetProperty(coluna);

                if (propriedade == null)
                {
                    // A propriedade não existe na classe TesteOptico.
                    return new List<string?>();
                }

                var valoresUnicos = await _context.TestesOpticos
                                        .Include(p => p.GetTecnico)
                                        .Distinct()
                                        .ToListAsync();

                var resultado = valoresUnicos.Select(x => propriedade.GetValue(x)?.ToString());

                return (List<string?>)resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
           
        }
    }
}