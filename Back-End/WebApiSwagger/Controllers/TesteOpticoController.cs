using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using WebApiSwagger.Models;
using WebApiSwagger.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using WebApiSwagger.Utils;
using OfficeOpenXml;

namespace WebApiSwagger.Controllers
{
     [ApiController]
    [Route("Api/TesteOptico")]
   public class TesteOpticoController : Controller
    {
         private readonly ITesteOpticoRepository _testeOpticoRepository;
         private readonly IMaterialRedeRepository _materialRedeRepository;
         private readonly UploadXlsx _uploadXlsx;
         private readonly Paginacao _paginacao;
         private readonly IProgressoRepository _progressoRepository;

        public TesteOpticoController(ITesteOpticoRepository testeOpticoRepository, IProgressoRepository progressoRepository,IMaterialRedeRepository materialRedeRepository, UploadXlsx uploadXlsx, Paginacao paginacao)
        {
            _testeOpticoRepository = testeOpticoRepository;
            _materialRedeRepository = materialRedeRepository;
            _uploadXlsx = uploadXlsx;
            _paginacao = paginacao;
            _progressoRepository = progressoRepository;
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
                    SiglaEstacao = testeOptico.SiglaEstacao,
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
                    int modeloOut = 0;
                    for (int row = 8; row <= (_uploadXlsx.LinhasPreenchidas + 7); row++)
                    {
                        //Get valores DataTime String para tratamento
                        string dataContrucao = _uploadXlsx.Worksheet?.Cells[row, 12].Value.ToString()?.Trim() ?? "";
                        if (DateTime.TryParseExact(dataContrucao, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                        {
                            // Se sim, acrescenta os valores padrão de hora, minuto e segundo à string
                            dataContrucao += " 00:00:00";
                        }
                        DateTime _dataContrucao = DateTime.ParseExact(dataContrucao, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                        string dataTeste = _uploadXlsx.Worksheet?.Cells[row, 15].Value.ToString()?.Trim() ?? "";
                        if (DateTime.TryParseExact(dataTeste, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                        {
                            // Se sim, acrescenta os valores padrão de hora, minuto e segundo à string
                            dataTeste += " 00:00:00";
                        }
                        DateTime _dataTeste = DateTime.ParseExact(dataTeste, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                        string dataRecebimento = _uploadXlsx.Worksheet?.Cells[row, 16].Value.ToString()?.Trim() ?? "";
                        if (DateTime.TryParseExact(dataTeste, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                        {
                            // Se sim, acrescenta os valores padrão de hora, minuto e segundo à string
                            dataRecebimento += " 00:00:00";
                        }
                        DateTime _dataRecebimento = DateTime.ParseExact(dataRecebimento, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                        var _uf = _uploadXlsx.Worksheet?.Cells[row, 2].Value?.ToString()?.ToUpper()?.Trim();
                        var _siglaEstacao = _uploadXlsx.Worksheet?.Cells[row, 4].Value?.ToString()?.ToUpper()?.Trim();
                        var _cdo = _uploadXlsx.Worksheet?.Cells[row, 8].Value?.ToString()?.ToUpper()?.Trim();
                        var _chave = $"{_uf}-{_siglaEstacao?.Replace(" ", "") ?? ""}{_cdo}";

                        var _estacao = _materialRedeRepository.CarregarChave(_chave).Result.NomeAbastecedora_Mt;

                        var modelo = new TesteOptico
                            {
                                CHAVE = _chave,
                                UF = _uf,
                                Construtora = _uploadXlsx.Worksheet?.Cells[row, 3].Value?.ToString()?.ToUpper()?.Trim(),
                                SiglaEstacao = _siglaEstacao,
                                Estacao = _estacao,
                                TipoObra = _uploadXlsx.Worksheet?.Cells[row, 5].Value?.ToString()?.ToUpper()?.Trim(),
                                Cabo = _uploadXlsx.Worksheet?.Cells[row, 6].Value?.ToString()?.ToUpper()?.Trim(),                           
                                Celula = _uploadXlsx.Worksheet?.Cells[row, 7].Value?.ToString()?.ToUpper()?.Trim(),
                                CDO = _cdo?.Trim() ?? "",  
                                Capacidade = _uploadXlsx.Worksheet?.Cells[row, 9].Value?.ToString()?.ToUpper()?.Trim(),
                                TotalUMs = int.Parse(_uploadXlsx.Worksheet?.Cells[row, 10].Value?.ToString()?.Trim() ?? ""),
                                EstadoCampo = _uploadXlsx.Worksheet?.Cells[row, 11].Value?.ToString()?.ToUpper()?.Trim(),
                                DataConstrucao = _dataContrucao,
                                EquipeConstrucao = _uploadXlsx.Worksheet?.Cells[row, 14].Value?.ToString()?.ToUpper()?.Trim(),
                                DataTeste = _dataTeste,
                                DataRecebimento = _dataRecebimento,
                                Tecnico = _uploadXlsx.Worksheet?.Cells[row, 18].Value?.ToString()?.ToUpper()?.Trim(),  
                                PosicaoIcxDgo = _uploadXlsx.Worksheet?.Cells[row, 19].Value?.ToString()?.ToUpper()?.Trim(),
                                FibraDGO = _uploadXlsx.Worksheet?.Cells[row, 20].Value?.ToString()?.ToUpper()?.Trim(),
                                SplitterCEOS = _uploadXlsx.Worksheet?.Cells[row, 21].Value?.ToString()?.ToUpper()?.Trim(),
                                BobinaLancamento = _uploadXlsx.Worksheet?.Cells[row, 22].Value?.ToString()?.ToUpper()?.Trim(),
                                BobinaRecepcao = _uploadXlsx.Worksheet?.Cells[row, 23].Value?.ToString()?.ToUpper()?.Trim(),
                                QuantidadeTeste = _uploadXlsx.Worksheet?.Cells[row, 24].Value?.ToString()?.ToUpper()?.Trim(),
                                Id_MaterialRede = _materialRedeRepository.CarregarChave(_chave).Result.Id_MaterialRede,
                                Sel = 1     
                            };


                            listaModelo.Add(modelo);
                       
                    }
                    // Salvar os dados no banco de dados
                    foreach (var optico in listaModelo)
                    {
                        var unique = await _testeOpticoRepository.Unique(optico.UF ?? "", optico.SiglaEstacao ?? "", optico.CDO ?? "");
                        
                        if(unique.UF != optico.UF && unique.SiglaEstacao != optico.SiglaEstacao && unique.CDO != optico.CDO){    
                            await _testeOpticoRepository.Inserir(optico);
                        }else{
                            await _testeOpticoRepository.Editar(unique.Id_TesteOptico, optico);
                            modeloOut += 1;
                        }
                                                
                    }

                    return Ok(
                        listaModelo.Count != 0 ?
                            listaModelo.Count > 1 ?
                                modeloOut != 0 ?
                                    modeloOut > 1 ?
                                    $"{listaModelo.Count} CDOs importadas com sucesso. {modeloOut} CDOs já constam na base dados e foram atualizadas."
                                    : $"{listaModelo.Count} CDOs importadas com sucesso. 1 CDO já consta na base de dados e foi atualizada"
                                : $"{listaModelo.Count} CDOs importadas com sucesso."    
                            :
                            modeloOut != 0 ?
                                    modeloOut > 1 ?
                                    $"{listaModelo.Count} CDO importadas com sucesso. {modeloOut} CDOs já constam na base dados e foram atualizadas."
                                    : $"{listaModelo.Count} CDO importadas com sucesso. 1 CDO já consta na base de dados e foi atualizada."
                                : $"{listaModelo.Count} CDO importadas com sucesso." 
                        : "Todas as CDOs já constam na base de dados e foram atualizadas.");    
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
                    DateTime? _dataContrucao = null;
                    DateTime? _dataTeste = null;
                    DateTime? _dataRecebimento = null;
                    //Get valores DataTime String para tratamento
                    string dataContrucao = testeOptico.DataConstrucao.ToString() ?? "";
                    if(!string.IsNullOrEmpty(dataContrucao)){
                    _dataContrucao = DateTime.ParseExact(dataContrucao, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                    }
                    string dataTeste = testeOptico.DataTeste.ToString() ?? "";
                    if(!string.IsNullOrEmpty(dataTeste)){
                    _dataTeste = DateTime.ParseExact(dataTeste, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                    }
                    string dataRecebimento = testeOptico.DataRecebimento.ToString() ?? "";
                    if(!string.IsNullOrEmpty(dataRecebimento)){
                    _dataRecebimento = DateTime.ParseExact(dataRecebimento, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                    }

                    var modelo = new TesteOptico{

                    CHAVE = testeOptico.CHAVE,    
                    UF = testeOptico.UF,
                    Construtora = testeOptico.Construtora,
                    SiglaEstacao = testeOptico.SiglaEstacao,
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
                    DataConstrucao = _dataContrucao,
                    EquipeConstrucao = testeOptico.EquipeConstrucao,
                    DataTeste = _dataTeste,
                    Tecnico = testeOptico.Tecnico,
                    DataRecebimento = _dataRecebimento,
                    BobinaLancamento = testeOptico.BobinaLancamento,
                    BobinaRecepcao = testeOptico.BobinaRecepcao,
                    PosicaoIcxDgo = testeOptico.PosicaoIcxDgo,
                    SplitterCEOS = testeOptico.SplitterCEOS,
                    FibraDGO = testeOptico.FibraDGO,
                     Sel = testeOptico.Sel,
                    Id_MaterialRede = _materialRedeRepository.CarregarChave(testeOptico.CHAVE).Result.Id_MaterialRede
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

                var lista = await _testeOpticoRepository.Listar(_progressoRepository,filtro, _paginacao);
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
                        SiglaEstacao = optico.SiglaEstacao,
                        Estacao = optico.Estacao,
                        DataRecebimento = dataRecebimentoBr,
                        DataConstrucao = dataConstrucaoBr,
                        DataTeste = dataTesteBr,
                        CDO = optico.CDO,
                        Cabo = optico.Cabo,
                        Celula = optico.Celula,
                        TotalUMs = optico.TotalUMs,
                        Tecnico = optico.Tecnico,
                        Id_MaterialRede = optico.Id_MaterialRede,
                        Sel = optico.Sel,
                        getAnalise = optico.Analises,
                        getValidacao = optico.Validacoes,
                        
                        
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

        [HttpPost("DownloadExcel")]
        public async Task<IActionResult> DownloadExcel(FiltroTesteOptico filtro)
        {
            try
            {
                _paginacao.Pagina = 1;
                _paginacao.Tamanho = 50000;
                
                // Caminho completo para o arquivo XLSX na pasta "Downloads"
                string pastaDoProjeto = Directory.GetCurrentDirectory();
                string _templatePath = Path.Combine(pastaDoProjeto, "Downloads", "TB_Controle_de_Campo.xlsx");

                var stream = new MemoryStream();

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                var fileInfo = new FileInfo(_templatePath);

                int rows = 1;
                
                using (var package = new ExcelPackage(fileInfo))
                {
                        var workSheet = package.Workbook.Worksheets[0]; 
    
                        workSheet.Cells[4, 3].Value = $"REGIÃO {filtro.UF?.ToUpper() ?? ""}";
                        int row = 8; 

                        do
                        {
                            var dados = await _testeOpticoRepository.ControleCampo(_progressoRepository, filtro, _paginacao, 0);
                           
                            _paginacao.TotalPaginas = _paginacao.Total / _paginacao.Tamanho;

                            if (dados != null)
                            {

                                foreach (var item in dados)
                                {
                                    var _analises = item.Analises?.FirstOrDefault() ?? new ControleCampoViewModel.AnaliseViewModel();
                                    var _enderecosTotais = item.MaterialRede?.EnderecoTotal.FirstOrDefault() ?? new ControleCampoViewModel.EnderecoTotalViewModel();
                                    var _ligacoes = item.MaterialRede?.Ligacao.FirstOrDefault() ?? new ControleCampoViewModel.LigacaoViewModel();                        

                                    var dataRecebimentoBr = FormatDateTime(item.DataRecebimento);
                                    var dataAnaliseBr = FormatDateTime(_analises?.DataAnalise);
                                    var tipo = item.Analises?.Count() > 1 ? "RE-TESTE" : "TESTE";

                                    // Preencha as células conforme necessário
                                    workSheet.Cells[row, 1].Value = item.CHAVE ?? "-"; // Exemplo
                                    workSheet.Cells[row, 2].Value = item.UF ?? "-"; // Exemplo
                                    workSheet.Cells[row, 3].Value = item.SiglaEstacao ?? "-"; // Exemplo
                                    workSheet.Cells[row, 4].Value = item.TipoObra ?? "-"; // Exemplo
                                    workSheet.Cells[row, 5].Value = item.Cabo ?? "-"; // Exemplo
                                    workSheet.Cells[row, 6].Value = item.Celula ?? "-"; // Exemplo
                                    workSheet.Cells[row, 7].Value = item.CDO; // Exemplo
                                    workSheet.Cells[row, 8].Value = item.Capacidade ?? "-"; // Exemplo
                                    workSheet.Cells[row, 9].Value = item.TotalUMs; // Exemplo
                                    workSheet.Cells[row, 10].Value = item.Endereco; // Exemplo
                                    workSheet.Cells[row, 11].Value = item.Construtora ?? "-"; // Exemplo
                                    workSheet.Cells[row, 12].Value = item.EstadoProjeto ?? "-"; // Exemplo
                                    workSheet.Cells[row, 13].Value = item.EstadoControle ?? "-"; // Exemplo
                                    workSheet.Cells[row, 14].Value = "-"; // Exemplo
                                    workSheet.Cells[row, 15].Value =  FormatBaseAcumulada(_enderecosTotais?.AnoMes ?? "") ?? "-"; // Exemplo
                                    workSheet.Cells[row, 16].Value = dataRecebimentoBr; // Exemplo
                                    workSheet.Cells[row, 17].Value = dataAnaliseBr; // Exemplo
                                    workSheet.Cells[row, 18].Value = tipo; // Exemplo
                                    workSheet.Cells[row, 19].Value = _analises?.Status ?? "-"; // Exemplo
                                    workSheet.Cells[row, 20].Value = _analises?.Analista ?? "-"; // Exemplo
                                    workSheet.Cells[row, 21].Value = _analises?.AnaliseObservacao; // Exemplo
                                    workSheet.Cells[row, 22].Value = _enderecosTotais?.TipoViabilidade ?? "-"; // Exemplo
                                    workSheet.Cells[row, 23].Value = _enderecosTotais?.Cod_Viabilidade ?? "-"; // Exemplo
                                    workSheet.Cells[row, 24].Value = _testeOpticoRepository.ObterViabilidade(_enderecosTotais?.Cod_Viabilidade ?? ""); // Exemplo
                                    workSheet.Cells[row, 25].Value = item.MaterialRede?.EstadoOperacional_Mt ?? "-"; // Exemplo
                                    workSheet.Cells[row, 26].Value = item.MaterialRede?.GrupoOperacional_Mt ?? "-"; // Exemplo
                                    workSheet.Cells[row, 27].Value = item.MaterialRede?.EstadoControle_Mt ?? "-"; // Exemplo
                                    workSheet.Cells[row, 28].Value = "-"; // Exemplo
                                    workSheet.Cells[row, 29].Value = _ligacoes?.DGO_ls ?? "-"; // Exemplo
                                    workSheet.Cells[row, 30].Value = _ligacoes?.FibraDgo_ls ?? "-"; // Exemplo
                                    workSheet.Cells[row, 31].Value = UltimaPorta(_ligacoes ?? new ControleCampoViewModel.LigacaoViewModel()) ?? "-"; // Exemplo

                                    row++;    
                                    rows ++;
                                    
                                    _progressoRepository.UpdateProgress(true, (rows - 1), $"Transferindo dados...", _paginacao.Total);
                                    await Task.Delay(0);

                                }
                            }
                            _paginacao.Pagina++;

                            package.SaveAs(stream);
                            stream.Position = 0;
                            
                        } while((_paginacao.Pagina - 1) <= _paginacao.TotalPaginas);
                    

                    string excelName = $"TB_Controle_de_Campo-{DateTime.Now.ToString("yyyyMMddHHmmss")}.xlsx";
                    return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message ="Ocorreu um erro ao exportar o arquivo CSV: " + ex.StackTrace });
            }
        }

        [HttpGet("ControleCampo")]
        public async Task<IActionResult> ControleCampo([FromQuery] FiltroTesteOptico filtro)
        {
            try
            {
                _paginacao.Pagina = filtro.Pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var lista = await _testeOpticoRepository.ControleCampo(_progressoRepository,filtro, _paginacao, 1);
                var resultado = new List<object>();

                foreach(var optico in lista){
                    var _analises = optico.Analises?.FirstOrDefault() ?? new ControleCampoViewModel.AnaliseViewModel();
                    var _enderecosTotais = optico.MaterialRede?.EnderecoTotal.FirstOrDefault() ?? new ControleCampoViewModel.EnderecoTotalViewModel();
                    var _ligacoes = optico.MaterialRede?.Ligacao.FirstOrDefault() ?? new ControleCampoViewModel.LigacaoViewModel();                        

                    var dataRecebimentoBr = FormatDateTime(optico.DataRecebimento);
                    var dataAnaliseBr = FormatDateTime(_analises?.DataAnalise);
                    var tipo = optico.Analises?.Count() > 1 ? "RE-TESTE" : "TESTE";
                    

                    var modelo = new {
                        CHAVE = optico.CHAVE,    
                        UF = optico.UF,
                        SiglaEstacao = optico.SiglaEstacao,
                        TipoObra = optico.TipoObra,
                        Cabo = optico.Cabo,
                        Celula = optico.Celula,
                        CDO = optico.CDO,
                        Capacidade = optico.Capacidade,
                        TotalUMs = optico.TotalUMs,
                        Endereco = optico.MaterialRede?.Endereco_Mt,
                        Construtora = optico.Construtora,
                        EstadoProjeto = optico.EstadoProjeto,
                        EstadoControle = optico.EstadoControle,
                        AceitacaoData = optico.AceitacaoData,
                        BaseAcumulada = FormatBaseAcumulada(_enderecosTotais?.AnoMes ?? ""),
                        DataRecebimento = dataRecebimentoBr,
                        DataAnalise = dataAnaliseBr,
                        Tipo = tipo,
                        Status = _analises?.Status,
                        Analista = _analises?.Analista,
                        ObsAnalise = _analises?.AnaliseObservacao,
                        StatusNetwin = _enderecosTotais?.TipoViabilidade,
                        CodNetwin = _enderecosTotais?.Cod_Viabilidade,
                        PendenciaViab = _testeOpticoRepository.ObterViabilidade(_enderecosTotais?.Cod_Viabilidade ?? ""),
                        EstadoOperacional = optico.MaterialRede?.EstadoOperacional_Mt,
                        GrupoControle = optico.MaterialRede?.GrupoOperacional_Mt,
                        EstadoControle_Mt = optico.MaterialRede?.EstadoControle_Mt,
                        PosicaoDGO = _ligacoes?.DGO_ls,
                        FibraDGO = _ligacoes?.FibraDgo_ls,
                        PortasOcupadas = UltimaPorta(_ligacoes ?? new ControleCampoViewModel.LigacaoViewModel())
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
               return BadRequest("Ocorreu um erro ao listar: " + ex.StackTrace);
            }
            
        }

        private string FormatDateTime(DateTime? dateTime)
        {
            return dateTime?.ToString("dd-MM-yyyy") ?? "";
        }

        private string FormatBaseAcumulada(string baseAcumuladaOriginal)
        {
            if (string.IsNullOrEmpty(baseAcumuladaOriginal))
                return "";

            int ano = int.Parse(baseAcumuladaOriginal.Substring(0, 4));
            int mes = int.Parse(baseAcumuladaOriginal.Substring(4, 2));
            string nomeMes = new DateTime(ano, mes, 1).ToString("MMM").ToUpper();
            return $"({baseAcumuladaOriginal.Substring(6)}) {nomeMes}/{ano}";
        }

        private string UltimaPorta (ControleCampoViewModel.LigacaoViewModel ligacoes)
        {
            string _cicloVida = ligacoes?.EstadoCicloVida_ls ?? "";
            string portasOcupadas = ligacoes?.PortaCdo_ls ?? "";
            string ultimoNumeroPorta = "-";

            if (!string.IsNullOrEmpty(portasOcupadas))
            {
                if (_cicloVida == "Em Projeto")
                {
                    ultimoNumeroPorta = "0";
                }
                else
                {
                // Divide a string em uma lista de números
                    var numerosPortas = portasOcupadas
                        .Split("|").Select(n =>
                            {
                                int numero;
                                if (int.TryParse(n.Trim(), out numero))
                                {
                                    return numero;
                                }
                                else
                                {
                                    return 0;
                                }
                            }).OrderBy(n => n).ToList();
                            
                            // Extrai o último número da lista
                            ultimoNumeroPorta = numerosPortas[0] != 0 ? numerosPortas.Last().ToString() : "";
                            
                }
            }
            return ultimoNumeroPorta;
        }

        [HttpGet("ControleCdo")]
        public async Task<IActionResult> ControleCdo([FromQuery] FiltroTesteOptico filtro)
        {
            try
            {
                _paginacao.Pagina = filtro.Pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var lista = await _testeOpticoRepository.ControlerCdo(_progressoRepository,filtro, _paginacao);
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
                        SiglaEstacao = optico.SiglaEstacao,
                        Estacao = optico.Estacao,
                        DataRecebimento = dataRecebimentoBr,
                        DataConstrucao = dataConstrucaoBr,
                        DataTeste = dataTesteBr,
                        CDO = optico.CDO,
                        Cabo = optico.Cabo,
                        Celula = optico.Celula,
                        TotalUMs = optico.TotalUMs,
                        Tecnico = optico.Tecnico,
                        Sel = optico.Sel,
                        getAnalise = optico.Analises,
                        Id_MaterialRede = optico.Id_MaterialRede
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
               return BadRequest("Ocorreu um erro ao listar: " + ex.InnerException);
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
        public async Task<IActionResult> ListaUnica()
        {
            try
            {
                var resultado = await _testeOpticoRepository.ListaUnica();

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