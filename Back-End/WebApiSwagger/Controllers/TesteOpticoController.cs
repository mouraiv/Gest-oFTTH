using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using WebApiSwagger.Models;
using WebApiSwagger.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.Diagnostics;

namespace WebApiSwagger.Controllers
{
    [Route("Api/TesteOptico")]
   public class TesteOpticoController : Controller
    {
         private readonly ITesteOpticoRepository _testeOpticoRepository;

        public TesteOpticoController(ITesteOpticoRepository testeOpticoRepository)
        {
            _testeOpticoRepository = testeOpticoRepository;
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
        [HttpPost("UploadArquivo")]
        public async Task<IActionResult> UploadArquivo(IFormFile arquivo)
        {
            if (arquivo == null || arquivo.Length == 0)
            {
                return BadRequest("Nenhum arquivo enviado.");
            }

            // Verifique a extensão do arquivo
            if (!Path.GetExtension(arquivo.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("O arquivo deve estar no formato .xlsx.");
            }

            try
            {
                using (var stream = new MemoryStream())
                {
                    
                    await arquivo.CopyToAsync(stream);
                    int linhasPreenchidas = 0;

                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                        var worksheet = package.Workbook.Worksheets[0];

                        //Validar arquivo xlsx de importar
                        var totalRows = worksheet.Dimension.End.Row;
                        var totalColumns = 2;
                        var totalCells = totalRows * totalColumns;
                        
                        //Verificar celulas correspondentes
                        for (int row = 8; row <= totalRows; row++)
                        {
                            bool TamanhoTotalXlsx = false;

                            for (int col = 2; col <= totalColumns; col++)
                            {
                                var cellValue = worksheet.Cells[row, col].Value;
                                if (cellValue != null && !string.IsNullOrWhiteSpace(cellValue.ToString()))
                                {
                                    TamanhoTotalXlsx = true;
                                    break;
                                }
                            }

                            if (TamanhoTotalXlsx)
                            {
                                linhasPreenchidas++;
                            }
                        }

                        Debug.WriteLine("------->",linhasPreenchidas);

                        if (linhasPreenchidas < 1)
                        {
                            return BadRequest($"Arquivo de importação está vazio.");
                            
                        }else if (linhasPreenchidas > 50 )
                        {
                            return BadRequest($"Arquivo de importação não podem exceder o limite de 50 linhas.");
                        }
                        else
                        {    
                            // Mapear as colunas do arquivo XLSX para as propriedades 
                            var listaModelo = new List<TesteOptico>();
                            for (int row = 8; row <= (linhasPreenchidas + 7); row++)
                            {
                                var modelo = new TesteOptico
                                {
                                    CHAVE = $"{worksheet.Cells[row, 2].Value?.ToString()?.ToUpper()}-{worksheet.Cells[row, 4].Value?.ToString()?.ToUpper()}{worksheet.Cells[row, 8].Value?.ToString()?.ToUpper()}",
                                    UF = worksheet.Cells[row, 2].Value?.ToString()?.ToUpper(),
                                    Construtora = worksheet.Cells[row, 3].Value?.ToString()?.ToUpper(),
                                    Estacao = worksheet.Cells[row, 4].Value?.ToString()?.ToUpper(),
                                    TipoObra = worksheet.Cells[row, 5].Value?.ToString()?.ToUpper(),
                                    Cabo = worksheet.Cells[row, 6].Value?.ToString()?.ToUpper(),                           
                                    Celula = worksheet.Cells[row, 7].Value?.ToString()?.ToUpper(),
                                    CDO = worksheet.Cells[row, 8].Value?.ToString()?.ToUpper(),  
                                    Capacidade = worksheet.Cells[row, 9].Value?.ToString()?.ToUpper(),
                                    TotalUMs = worksheet.Cells[row, 10].Value?.ToString()?.ToUpper(),
                                    EstadoCampo = worksheet.Cells[row, 11].Value?.ToString()?.ToUpper(),
                                    //DataConstrucao = DateTime.FromOADate(double.Parse(worksheet.Cells[row, 12].Value?.ToString()?.ToUpper() ?? "")),
                                    EquipeConstrucao = worksheet.Cells[row, 14].Value?.ToString()?.ToUpper(),
                                    //DataTeste = DateTime.FromOADate(double.Parse(worksheet.Cells[row, 15].Value?.ToString()?.ToUpper() ?? "")),
                                    //DataRecebimento = DateTime.FromOADate(double.Parse(worksheet.Cells[row, 16].Value?.ToString()?.ToUpper() ?? "")),
                                    Tecnico = worksheet.Cells[row, 18].Value?.ToString()?.ToUpper(),  
                                    PosicaoIcxDgo = worksheet.Cells[row, 19].Value?.ToString()?.ToUpper(),
                                    FibraDGO = worksheet.Cells[row, 20].Value?.ToString()?.ToUpper(),
                                    SplitterCEOS = worksheet.Cells[row, 21].Value?.ToString()?.ToUpper(),
                                    BobinaLancamento = worksheet.Cells[row, 22].Value?.ToString()?.ToUpper(),
                                    BobinaRecepcao = worksheet.Cells[row, 23].Value?.ToString()?.ToUpper(),
                                    QuantidadeTeste = worksheet.Cells[row, 24].Value?.ToString()?.ToUpper()      
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
        public async Task<IActionResult> Listar(FiltroTesteOptico filtro)
        {
            try
            {
                var resultado = await _testeOpticoRepository.Listar(filtro);

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

        [HttpGet("ListaUnica/{coluna}")]
        public async Task<IActionResult> ListaUnica(string coluna)
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