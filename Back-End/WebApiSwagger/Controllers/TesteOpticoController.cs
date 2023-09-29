using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using WebApiSwagger.Models;
using WebApiSwagger.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Controllers
{
     [ApiController]
    [Route("Api/TesteOptico")]
   public class TesteOpticoController : Controller
    {
         private readonly ITesteOpticoRepository _testeOpticoRepository;
         private readonly UploadXlsx _uploadXlsx;
         private readonly Paginacao _paginacao;

        public TesteOpticoController(ITesteOpticoRepository testeOpticoRepository, UploadXlsx uploadXlsx, Paginacao paginacao)
        {
            _testeOpticoRepository = testeOpticoRepository;
            _uploadXlsx = uploadXlsx;
            _paginacao = paginacao;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(TesteOpticoView testeOptico)
        {
            try
            {
                var modelo = new TesteOptico{

                    CHAVE = testeOptico.CHAVE,
                    UF = testeOptico.UF,
                    Construtora = testeOptico.Construtora,
                    Estacao = testeOptico.Estacao,
                    TipoObra = testeOptico.TipoObra,
                    CDO = testeOptico.CDO,
                    Cabo = testeOptico.Cabo,
                    Celula = testeOptico.Celula,
                    Capacidade = testeOptico.Capacidade,
                    TotalUMs = testeOptico.TotalUMs,
                    Endereco = testeOptico.Endereco,
                    EstadoCampo = testeOptico.EstadoCampo,
                    EstadoProjeto = testeOptico.EstadoProjeto,
                    EstadoControle = testeOptico.EstadoControle,
                    AceitacaoData = testeOptico.AceitacaoData,
                    AceitacaoMesRef = testeOptico.AceitacaoMesRef,
                    TesteObservacao = testeOptico.TesteObservacao,
                    Meta = testeOptico.Meta,
                    DataConstrucao = testeOptico.DataConstrucao,
                    EquipeConstrucao = testeOptico.EquipeConstrucao,
                    DataTeste = testeOptico.DataTeste,
                    Tecnico = testeOptico.Tecnico,
                    DataRecebimento = testeOptico.DataRecebimento,
                    BobinaLancamento = testeOptico.BobinaLancamento,
                    BobinaRecepcao = testeOptico.BobinaRecepcao,
                    QuantidadeTeste = testeOptico.QuantidadeTeste,
                    PosicaoIcxDgo = testeOptico.PosicaoIcxDgo,
                    SplitterCEOS = testeOptico.SplitterCEOS,
                    FibraDGO = testeOptico.FibraDGO,
                    Id_Tecnico = testeOptico.Id_Tecnico,

                };

                var resultado = await _testeOpticoRepository.Inserir(modelo);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPost("UploadModelo")]
        public async Task<IActionResult> UploadArquivo(IFormFile arquivo)
        {
            try
            {
                if (arquivo == null || arquivo.Length == 0)
                {
                    return BadRequest("Nenhum arquivo enviado.");
                }
                if (!Path.GetExtension(arquivo.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("O arquivo deve estar no formato .xlsx.");
                }

                _uploadXlsx.Carregar(/*Arquivo Xlsx*/ arquivo.OpenReadStream(), /*Index Coluna*/ 2, /*Index Row*/ 8);
               
                if (_uploadXlsx.LinhasPreenchidas < 1)
                {
                    return BadRequest($"Arquivo de importação está vazio.");           
                }
                else if (_uploadXlsx.LinhasPreenchidas > 50 )
                {
                    return BadRequest($"Arquivo de importação não podem exceder o limite de 50 linhas.");
                }
                else
                {    
                    // Mapear as colunas do arquivo XLSX para as propriedades 
                    var listaModelo = new List<TesteOptico>();
                    for (int row = 8; row <= (_uploadXlsx.LinhasPreenchidas + 7); row++)
                    {
                        //Get valores DataTime String para tratamento
                        string dataContrucao = _uploadXlsx.Worksheet?.Cells[row, 12].Value.ToString() ?? "";
                        DateTime _dataContrucao = DateTime.ParseExact(dataContrucao, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                        string dataTeste = _uploadXlsx.Worksheet?.Cells[row, 15].Value.ToString() ?? "";
                        DateTime _dataTeste = DateTime.ParseExact(dataTeste, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                        string dataRecebimento = _uploadXlsx.Worksheet?.Cells[row, 16].Value.ToString() ?? "";
                        DateTime _dataRecebimento = DateTime.ParseExact(dataRecebimento, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                        var modelo = new TesteOptico
                            {
                                CHAVE = $"{_uploadXlsx.Worksheet?.Cells[row, 2].Value?.ToString()?.ToUpper()}-{_uploadXlsx.Worksheet?.Cells[row, 4].Value?.ToString()?.ToUpper()}{_uploadXlsx.Worksheet?.Cells[row, 8].Value?.ToString()?.ToUpper()}",
                                UF = _uploadXlsx.Worksheet?.Cells[row, 2].Value?.ToString()?.ToUpper(),
                                Construtora = _uploadXlsx.Worksheet?.Cells[row, 3].Value?.ToString()?.ToUpper(),
                                Estacao = _uploadXlsx.Worksheet?.Cells[row, 4].Value?.ToString()?.ToUpper(),
                                TipoObra = _uploadXlsx.Worksheet?.Cells[row, 5].Value?.ToString()?.ToUpper(),
                                Cabo = _uploadXlsx.Worksheet?.Cells[row, 6].Value?.ToString()?.ToUpper(),                           
                                Celula = _uploadXlsx.Worksheet?.Cells[row, 7].Value?.ToString()?.ToUpper(),
                                CDO = _uploadXlsx.Worksheet?.Cells[row, 8].Value?.ToString()?.ToUpper(),  
                                Capacidade = _uploadXlsx.Worksheet?.Cells[row, 9].Value?.ToString()?.ToUpper(),
                                TotalUMs = _uploadXlsx.Worksheet?.Cells[row, 10].Value?.ToString()?.ToUpper(),
                                EstadoCampo = _uploadXlsx.Worksheet?.Cells[row, 11].Value?.ToString()?.ToUpper(),
                                DataConstrucao = _dataContrucao,
                                EquipeConstrucao = _uploadXlsx.Worksheet?.Cells[row, 14].Value?.ToString()?.ToUpper(),
                                DataTeste = _dataTeste,
                                DataRecebimento = _dataRecebimento,
                                Tecnico = _uploadXlsx.Worksheet?.Cells[row, 18].Value?.ToString()?.ToUpper(),  
                                PosicaoIcxDgo = _uploadXlsx.Worksheet?.Cells[row, 19].Value?.ToString()?.ToUpper(),
                                FibraDGO = _uploadXlsx.Worksheet?.Cells[row, 20].Value?.ToString()?.ToUpper(),
                                SplitterCEOS = _uploadXlsx.Worksheet?.Cells[row, 21].Value?.ToString()?.ToUpper(),
                                BobinaLancamento = _uploadXlsx.Worksheet?.Cells[row, 22].Value?.ToString()?.ToUpper(),
                                BobinaRecepcao = _uploadXlsx.Worksheet?.Cells[row, 23].Value?.ToString()?.ToUpper(),
                                QuantidadeTeste = _uploadXlsx.Worksheet?.Cells[row, 24].Value?.ToString()?.ToUpper()      
                            };

                            listaModelo.Add(modelo);
                    }
                    // Salvar os dados no banco de dados
                    foreach (var optico in listaModelo)
                    {
                        await _testeOpticoRepository.Inserir(optico);
                    }
                    return Ok("Arquivo importado com sucesso.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Ocorreu um erro ao importar o arquivo: {ex.Message}");
            }
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, TesteOpticoView testeOptico)
        {
            try
            {
                var modelo = new TesteOptico{

                    CHAVE = testeOptico.CHAVE,
                    UF = testeOptico.UF,
                    Construtora = testeOptico.Construtora,
                    Estacao = testeOptico.Estacao,
                    TipoObra = testeOptico.TipoObra,
                    CDO = testeOptico.CDO,
                    Cabo = testeOptico.Cabo,
                    Celula = testeOptico.Celula,
                    Capacidade = testeOptico.Capacidade,
                    TotalUMs = testeOptico.TotalUMs,
                    Endereco = testeOptico.Endereco,
                    EstadoCampo = testeOptico.EstadoCampo,
                    EstadoProjeto = testeOptico.EstadoProjeto,
                    EstadoControle = testeOptico.EstadoControle,
                    AceitacaoData = testeOptico.AceitacaoData,
                    AceitacaoMesRef = testeOptico.AceitacaoMesRef,
                    TesteObservacao = testeOptico.TesteObservacao,
                    Meta = testeOptico.Meta,
                    DataConstrucao = testeOptico.DataConstrucao,
                    EquipeConstrucao = testeOptico.EquipeConstrucao,
                    DataTeste = testeOptico.DataTeste,
                    Tecnico = testeOptico.Tecnico,
                    DataRecebimento = testeOptico.DataRecebimento,
                    BobinaLancamento = testeOptico.BobinaLancamento,
                    BobinaRecepcao = testeOptico.BobinaRecepcao,
                    QuantidadeTeste = testeOptico.QuantidadeTeste,
                    PosicaoIcxDgo = testeOptico.PosicaoIcxDgo,
                    SplitterCEOS = testeOptico.SplitterCEOS,
                    FibraDGO = testeOptico.FibraDGO,
                    Id_Tecnico = testeOptico.Id_Tecnico,

                };

                var resultado = await _testeOpticoRepository.Editar(id, modelo);
                          
                return Ok("Atualizado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao atualizar: " + ex.Message);
            }
            
        }
        [HttpDelete("Deletar/{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            try
            {
                var resultado = await _testeOpticoRepository.Deletar(id);

                return Ok("Deletado com sucesso!");
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao deletar: " + ex.Message);
            }
            
        }
        [HttpGet("Listar")]
        public async Task<IActionResult> Listar([FromQuery] FiltroTesteOptico filtro)
        {
            try
            {
                _paginacao.Pagina = filtro.Pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var lista = await _testeOpticoRepository.Listar(filtro, _paginacao);
                var resultado = new List<object>();

                foreach(var optico in lista){
                    DateTime? dataRecebimento = optico.DataRecebimento;
                    DateTime? dataConstrucao = optico.DataConstrucao;
                    DateTime? dataTeste = optico.DataTeste;

                    string dataRecebimentoBr = dataRecebimento != null ? dataRecebimento.Value.ToString("dd-MM-yyyy") : "";
                    string dataConstrucaoBr = dataConstrucao != null ? dataConstrucao.Value.ToString("dd-MM-yyyy") : "";
                    string dataTesteBr = dataTeste != null ? dataTeste.Value.ToString("dd-MM-yyyy") : "";

                    var modelo = new {
                        Id = optico.Id_TesteOptico,
                        UF = optico.UF,
                        Construtora = optico.Construtora,
                        Estacao = optico.Estacao,
                        DataRecebimento = dataRecebimentoBr,
                        DataConstrucao = dataConstrucaoBr,
                        DataTeste = dataTesteBr,
                        CDO = optico.CDO,
                        Cabo = optico.Cabo,
                        Celula = optico.Celula,
                        TotalUMs = optico.TotalUMs,
                        Tecnico = optico.Tecnico,
                        getAnalise = optico.Analises
                    };
                    resultado.Add(modelo);
                };

                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(
                    new {
                            Paginacao = _paginacao,
                            Resultado = resultado
                        });
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
            
        }

        [HttpGet("Detalhe")]
        public async Task<IActionResult> Detalhe([FromQuery] int id)
        {
            try
            {
                var resultado = await _testeOpticoRepository.CarregarId(id);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao carregar: " + ex.Message);
            }

        }

        [HttpGet("ListaUnica")]
        public async Task<IActionResult> ListaUnica([FromQuery] string coluna)
        {
            try
            {
                var resultado = await _testeOpticoRepository.ListaUnica(coluna);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }

        }
    }
}