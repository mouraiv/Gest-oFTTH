using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;
using OfficeOpenXml;

namespace WebApiSwagger.Controllers
{
     [ApiController]
    [Route("Api/EnderecoTotal")]
    public class EnderecoTotalController : Controller
    {
        private readonly IEnderecoTotalRepository _enderecoTotalRepository;
        private readonly Paginacao _paginacao;
        private readonly PainelGanho _painelGanho;
        private readonly IProgressoRepository _progressoRepository;

        public EnderecoTotalController(IEnderecoTotalRepository enderecoTotalRepository, IProgressoRepository progressoRepository, Paginacao paginacao,  PainelGanho painelGanho)
        {
            _enderecoTotalRepository = enderecoTotalRepository;
            _progressoRepository = progressoRepository;
            _paginacao = paginacao;
            _painelGanho = painelGanho;

        }

        [HttpPost("Listar")]
        public async Task<IActionResult> Listar(FiltroEnderecoTotal filtro)
        {
            try
            {
                _paginacao.Pagina = filtro.Pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.Listar(_progressoRepository ,filtro,_painelGanho,_paginacao, 1);

                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(
                    new {
                            Paginacao = _paginacao,
                            Painel = _painelGanho,
                            Resultado = resultado
                        });
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
           
        }
        [HttpPost("DownloadExcel")]
        public async Task<IActionResult> DownloadExcel(FiltroEnderecoTotal filtro, Paginacao paginacao)
        {
            try
            {
                // Caminho completo para o arquivo XLSX na pasta "Downloads"
                string pastaDoProjeto = Directory.GetCurrentDirectory();
                string _templatePath = Path.Combine(pastaDoProjeto,"Downloads","TB_EnderecoTotais.xlsx");
                
                var dados = await _enderecoTotalRepository.Listar(_progressoRepository ,filtro, _painelGanho, paginacao, 0);

                var stream = new MemoryStream();

                if (dados == null || dados.Count() == 0)
                {
                    return BadRequest(new { message = "Nenhum Registro para exportação." });
                }
                else if (dados.Count() > 1000000)
                {
                    return BadRequest(new { message = "A consulta excede o limite máximo de 1.000.000 de linhas para exportação."});
                }
                else
                {

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                var fileInfo = new FileInfo(_templatePath);
            
                using (var package = new ExcelPackage(fileInfo))
                {
                    var workSheet = package.Workbook.Worksheets[0]; // Assumindo que você deseja usar a primeira planilha
   
                    // Preencha a planilha com os dados
                    // A partir da linha 2 para não sobrescrever o cabeçalho
                    int row = 7; 
                    foreach (var item in dados)
                    {
                        // Preencha as células conforme necessário
                        workSheet.Cells[row, 1].Value = item.UF ?? "-"; // Exemplo
                        workSheet.Cells[row, 2].Value = item.Localidade ?? "-"; // Exemplo
                        workSheet.Cells[row, 3].Value = item.Celula ?? "-"; // Exemplo
                        workSheet.Cells[row, 4].Value = item.SiglaEstacao ?? "-"; // Exemplo
                        workSheet.Cells[row, 5].Value = item.MaterialRede?.NomeAbastecedora_Mt ?? "-"; // Exemplo
                        workSheet.Cells[row, 6].Value = item.NomeCdo ?? "-"; // Exemplo
                        workSheet.Cells[row, 7].Value = item.Cod_Viabilidade; // Exemplo
                        workSheet.Cells[row, 8].Value = item.TipoViabilidade ?? "-"; // Exemplo
                        workSheet.Cells[row, 9].Value = item.Cod_Survey ?? "-"; // Exemplo
                        workSheet.Cells[row, 10].Value = item.QuantidadeUMS; // Exemplo
                        workSheet.Cells[row, 11].Value = item.Disp_Comercial ?? "-"; // Exemplo
                        workSheet.Cells[row, 12].Value = item.MaterialRede?.GrupoOperacional_Mt ?? "-"; // Exemplo
                        workSheet.Cells[row, 13].Value = item.MaterialRede?.EstadoControle_Mt ?? "-"; // Exemplo
                        workSheet.Cells[row, 14].Value = item.MaterialRede?.EstadoOperacional_Mt ?? "-"; // Exemplo
                        
                        row++;
                    }

                    package.SaveAs(stream);
                    stream.Position = 0;
                }

                    string excelName = $"EnderecosTotais-{DateTime.Now.ToString("yyyyMMddHHmmss")}.xlsx";
                    return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message ="Ocorreu um erro ao exportar o arquivo Excel: " + ex.Message });
            }
        }
        [HttpGet("BaseAcumulada")]
        public async Task<IActionResult> BaseAcumulada([FromQuery]FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.BaseAcumulada(_progressoRepository ,filtro,_paginacao);

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
        [HttpGet("GanhoSurvey")]
        public async Task<IActionResult> GanhoSurvey([FromQuery]FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.ListarGanho(_progressoRepository ,filtro,_paginacao, _painelGanho);

                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(
                    new {
                            Paginacao = _paginacao,
                            Painel = _painelGanho,
                            Resultado = resultado
                        });
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
           
        }

        /*[HttpGet("GanhoSurveyDia")]
        public async Task<IActionResult> GanhoSurveyDia([FromQuery]FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.ListarGanhoDia(filtro,_paginacao, _painelGanho);
                
                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(
                    new {
                            Paginacao = _paginacao,
                            Painel = _painelGanho,
                            Resultado = resultado
                        });
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
           
        }*/

        [HttpGet("Carregar")]
        public async Task<IActionResult> Carregar([FromQuery] int id, string? survey, bool filterSurvey)
        {
            try
            {
                var resultado = await _enderecoTotalRepository.CarregarId(id, survey, filterSurvey);

                if (resultado == null)
                {
                    return NotFound(); 
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
             
        }
        [HttpGet("ListarCarregarId")]
        public async Task<IActionResult> ListarCarregarId([FromQuery] int? id)
        {
            try
            {
                var resultado = await _enderecoTotalRepository.ListarCarregarId(id);

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
        [HttpGet("ListaUnica")]
        public async Task<IActionResult> ListaUnica()
        {
            try
            {
                var resultado = await _enderecoTotalRepository.ListaUnica();

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
        [HttpGet("ListarUnicaLocalidade")]
        public async Task<IActionResult> ListarUnicaLocalidade([FromQuery]FiltroEnderecoTotal filtro)
        {
            try
            {

                var resultado = await _enderecoTotalRepository.ListaUnicaLocalidade(filtro);

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