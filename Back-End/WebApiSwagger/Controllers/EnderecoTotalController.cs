using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;
using OfficeOpenXml;
using CsvHelper;
using System.Globalization;
using WebApiSwagger.Models;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/EnderecoTotal")]
    public class EnderecoTotalController : Controller
    {
        private readonly IEnderecoTotalRepository _enderecoTotalRepository;
        private readonly IMaisDeUmaCDORepository _maisDeUmaCDORepository;
        private readonly IServicoAssociadoRepository _servicoAssociadoRepository;
        private readonly Paginacao _paginacao;
        private readonly PainelGanho _painelGanho;
        private readonly IProgressoRepository _progressoRepository;

        public EnderecoTotalController(IEnderecoTotalRepository enderecoTotalRepository, IMaisDeUmaCDORepository maisDeUmaCDORepository, IServicoAssociadoRepository servicoAssociadoRepository, IProgressoRepository progressoRepository, Paginacao paginacao, PainelGanho painelGanho)
        {
            _enderecoTotalRepository = enderecoTotalRepository;
            _maisDeUmaCDORepository = maisDeUmaCDORepository;
            _servicoAssociadoRepository = servicoAssociadoRepository;
            _progressoRepository = progressoRepository;
            _paginacao = paginacao;
            _painelGanho = painelGanho;

        }
        [HttpPost("ImportarMultiplaAssociacao")]
        [RequestSizeLimit(10_000_000_000)]
        public async Task<IActionResult> ImportarMultiplaAssociacao(IFormFile arquivo, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {

                if (arquivo == null || arquivo.Length == 0)
                {
                    return BadRequest("Nenhum arquivo enviado.");
                }
                if (!Path.GetExtension(arquivo.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("O arquivo deve estar no formato .csv.");
                }
                else
                {
                    using (var reader = new StreamReader(arquivo.OpenReadStream()))
                    using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                    {
                        // Ler registros do arquivo CSV
                        bool cabecalhoValido = false;

                        int totalLinhas = 0;
                        int row = 0;
                        //OBTER NUMERO DE LINHAS DA CSV
                        while (csv.Read())
                        {
                            cancellationToken.ThrowIfCancellationRequested();
                            totalLinhas++;
                        }
                        // Reiniciar a leitura do arquivo para processar os dados
                        reader.BaseStream.Seek(0, SeekOrigin.Begin);
                        //var separador = new char();

                        while (csv.Read())
                        {
                            // Verificar se o cabeçalho já foi validado
                            if (!cabecalhoValido)
                            {
                                var cabecalho = new string[csv.Context.Reader.ColumnCount];
                                for (int i = 0; i < csv.Context.Reader.ColumnCount; i++)
                                {
                                    cancellationToken.ThrowIfCancellationRequested();

                                    var value = csv.Context.Reader[i];
                                    //separador = DetectarSeparador(value);
                                    cabecalho = value.Split('|');


                                }

                                if (cabecalho[0] == "UF" &&
                                    cabecalho[1] == "Município" &&
                                    cabecalho[2] == "Localidade" &&
                                    cabecalho[3] == "Estação abastecedora" &&
                                    cabecalho[4] == "Célula" &&
                                    cabecalho[5] == "Survey" &&
                                    cabecalho[6] == "Associação CDO" &&
                                    cabecalho[7] == "Nome CDO" &&
                                    cabecalho[8] == "Data de associação")
                                {
                                    cabecalhoValido = true;
                                }
                                else
                                {

                                    return BadRequest("CSV incompatível com esse modelo.");

                                }
                            }

                            // Extrair campos da linha atual
                            for (int i = 0; i < csv.Context.Reader.ColumnCount; i++)
                            {
                                cancellationToken.ThrowIfCancellationRequested();

                                var campo = csv.Context.Reader[i];
                                var value = campo.Split('|');

                                //VALIDA CSV    
                                if (cabecalhoValido)
                                {
                                    // Verificar se as entradas já existem
                                    bool ignoreKey = await _enderecoTotalRepository.IgnoreKeyMultiplaAssociacao(value[0], value[3], value[7], value[5], value[6], value[8]);

                                    if (!ignoreKey)
                                    {
                                        //IGNORAR CABEÇALHO    
                                        if (value[0] != "UF")
                                        {

                                            var modelo = new EnderecoTotal
                                            {
                                                UF = value[0],
                                                Municipio = value[1],
                                                Localidade = value[2],
                                                SiglaEstacao = value[3],
                                                Celula = value[4],
                                                Cod_Survey = value[5],
                                                AssociacaoCDO = value[6],
                                                NomeCdo = value[7],
                                                DataAssociacao = value[8],
                                            };

                                            //recupera ID apara atualização 
                                            int surveyExist = await _enderecoTotalRepository.SurveyExistMultiplaAssociacao(modelo.AssociacaoCDO, modelo.Cod_Survey, modelo.NomeCdo, modelo.DataAssociacao);

                                            if (surveyExist != 0)
                                            {
                                                //atualizar registro no banco de dados
                                                await _enderecoTotalRepository.Editar(surveyExist, modelo);
                                                surveyExist = 0;
                                            }
                                            else
                                            {
                                                // Inserir um novo registro no banco de dados
                                                await _enderecoTotalRepository.Inserir(modelo);
                                            }
                                        }

                                    }
                                    row++;
                                    _progressoRepository.UpdateProgress(true, row, $"Transferindo dados...", totalLinhas);
                                }
                            }
                        }
                    }
                }
                return Ok("CSV importada com sucesso!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Ocorreu um erro ao importar a CSV: {ex.StackTrace}");
            }
        }

        [HttpPost("ImportarEnderecoTotal")]
        [RequestSizeLimit(10_000_000_000)]
        public async Task<IActionResult> ImportarEnderecoTotal(IFormFile arquivo, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                
                if (arquivo == null || arquivo.Length == 0)
                {
                    return BadRequest("Nenhum arquivo enviado.");
                }
                if (!Path.GetExtension(arquivo.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("O arquivo deve estar no formato .csv.");
                }
                else
                {
                    // Defina a codificação desejada, por exemplo, UTF-8
                    //Encoding encoding = Encoding.UTF8;

                    using (var reader = new StreamReader(arquivo.OpenReadStream()))
                    using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                    {
                        //Ler registros do arquivo CSV
                        bool cabecalhoValido = false;

                        int totalLinhas = 0;
                        int row = 0;
                        //OBTER NUMERO DE LINHAS DA CSV
                        while (csv.Read())
                        {
                            cancellationToken.ThrowIfCancellationRequested();
                            totalLinhas++;
                        }
                        // Reiniciar a leitura do arquivo para processar os dados
                        reader.BaseStream.Seek(0, SeekOrigin.Begin);
                        //var separador = new char();

                        while (csv.Read())
                        {
                            // Verificar se o cabeçalho já foi validado
                            if (!cabecalhoValido)
                            {
                                var cabecalho = new string[csv.Context.Reader.ColumnCount];
                                for (int i = 0; i < csv.Context.Reader.ColumnCount; i++)
                                {
                                    cancellationToken.ThrowIfCancellationRequested();
                                    
                                    var value = csv.Context.Reader[i];
                                    //separador = DetectarSeparador(value);
                                    cabecalho = value.Split('|');
                                    
                                }

                                if (cabecalho[0] == "CELULA" &&
                                    cabecalho[1] == "ESTACAO_ABASTECEDORA" &&
                                    cabecalho[2] == "UF" &&
                                    cabecalho[3] == "MUNICIPIO" &&
                                    cabecalho[4] == "LOCALIDADE" &&
                                    cabecalho[5] == "COD_LOCALIDADE" &&
                                    cabecalho[6] == "LOCALIDADE_ABREV" &&
                                    cabecalho[7] == "LOGRADOURO" &&
                                    cabecalho[8] == "COD_LOGRADOURO")
                                {
                                    cabecalhoValido = true;
                                }
                                else
                                {
                                    return BadRequest("CSV incompatível com esse modelo.");
                                }
                            }

                            // Extrair campos da linha atual
                            for (int i = 0; i < csv.Context.Reader.ColumnCount; i++)
                            {
                                cancellationToken.ThrowIfCancellationRequested();

                                var campo = csv.Context.Reader[i];
                                var value = campo.Split('|');

                                //VALIDA CSV    
                                if(cabecalhoValido){
                                    // Verificar se as entradas já existem
                                    bool ignoreKey = await _maisDeUmaCDORepository.IgnoreKey(value[0] ,value[3] ,value[5], value[6], value[8]);

                                    if(!ignoreKey){
                                    //IGNORAR CABEÇALHO    
                                        if(value[0] != "CELULA"){
                                        
                                            var modelo = new EnderecoTotal
                                            {
                                                UF = value[2],
                                                Logradouro = value[7],
                                                NumeroFachada = value[9], 
                                                Bairro = value[14],
                                                CEP = value[4],
                                                SiglaEstacao = value[1],
                                                NomeCdo = value[22],
                                                Cod_Survey = value[15],
                                                QuantidadeUMS = int.Parse(value[16]),
                                                Cod_Viabilidade = value[17],
                                                TipoViabilidade = value[18],
                                                TipoRede = value[19],
                                                Disp_Comercial = value[12],
                                                UCS_Residenciais = value[13],
                                                UCS_Comerciais = value[14]
                                            };

                                            //recupera ID apara atualização 
                                            //int  surveyExist = await _maisDeUmaCDORepository.SurveyExist(modelo.Associacao_CDO ,modelo.Survey_Mc, modelo.Data_de_associacao);

                                            //if (surveyExist != 0)
                                            //{
                                                //atualizar registro no banco de dados
                                                //await _maisDeUmaCDORepository.Editar(surveyExist, modelo);
                                                //surveyExist = 0;
                                            //}
                                            //else
                                            //{
                                                // Inserir um novo registro no banco de dados
                                                //await _maisDeUmaCDORepository.Inserir(modelo);
                                            //}
                                        }
                                           
                                    }
                                    row++; 
                                    _progressoRepository.UpdateProgress(true, row, $"Transferindo dados...", totalLinhas);
                                }
                            }
                        }
                    }
                }
                return Ok("CSV importada com sucesso!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Ocorreu um erro ao importar a CSV: {ex.InnerException?.StackTrace}");
            }
        }

        [HttpGet("GraficoPrincipal")]
        public async Task<IActionResult> GraficoPrincipal()
        {
            try
            {

                var resultado = await _enderecoTotalRepository.GraficoPrincipal();

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado.");
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao listar: " + ex.StackTrace);
            }

        }

        [HttpPost("Listar")]
        public async Task<IActionResult> Listar(FiltroEnderecoTotal filtro)
        {
            try
            {
                _paginacao.Pagina = filtro.Pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.Listar(_progressoRepository, filtro, _painelGanho, _paginacao, 1);

                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado.");
                }

                return Ok(
                    new
                    {
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
        public async Task<IActionResult> DownloadExcel(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, Paginacao paginacao)
        {
            try
            {
                _paginacao.Pagina = 1;
                _paginacao.Tamanho = 50000;

                // Caminho completo para o arquivo XLSX na pasta "Downloads"
                string pastaDoProjeto = Directory.GetCurrentDirectory();
                string _templatePath = Path.Combine(pastaDoProjeto, "Downloads", "TB_EnderecoTotais.xlsx");

                var stream = new MemoryStream();

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                var fileInfo = new FileInfo(_templatePath);

                int rows = 1;

                using (var package = new ExcelPackage(fileInfo))
                {
                    var workSheet = package.Workbook.Worksheets[0];

                    workSheet.Cells[3, 3].Value = $"ENDEREÇOS TOTAIS";
                    int row = 7;

                    do
                    {
                        var dados = await _enderecoTotalRepository.Listar(_progressoRepository, filtro, _painelGanho, paginacao, 0);

                        _paginacao.TotalPaginas = _paginacao.Total / _paginacao.Tamanho;

                        if (dados != null)
                        {

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
                                rows++;

                                progressoRepository.UpdateProgress(true, (rows - 1), $"Transferindo dados...", _paginacao.Total);
                                await Task.Delay(0);

                            }
                        }
                        _paginacao.Pagina++;

                        package.SaveAs(stream);
                        stream.Position = 0;

                    } while ((_paginacao.Pagina - 1) <= _paginacao.TotalPaginas);


                    string excelName = $"TB_EnderecoTotais-{DateTime.Now.ToString("yyyyMMddHHmmss")}.xlsx";
                    return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Ocorreu um erro ao exportar o arquivo CSV: " + ex.StackTrace });
            }
        }
        [HttpGet("BaseAcumulada")]
        public async Task<IActionResult> BaseAcumulada([FromQuery] FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.BaseAcumulada(_progressoRepository, filtro, _paginacao);

                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado.");
                }

                return Ok(
                    new
                    {
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
        public async Task<IActionResult> GanhoSurvey([FromQuery] FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.ListarGanho(_progressoRepository, filtro, _paginacao, _painelGanho);

                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado.");
                }

                return Ok(
                    new
                    {
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
        public async Task<IActionResult> ListarUnicaLocalidade([FromQuery] FiltroEnderecoTotal filtro)
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