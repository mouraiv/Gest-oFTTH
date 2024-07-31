using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;
using OfficeOpenXml;
using CsvHelper;
using System.Globalization;
using WebApiSwagger.Models;
using System.Text;
using CsvHelper.Configuration;
using WebApiSwagger.Models.Base;
using System.Text.RegularExpressions;

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
        /*[HttpPost("ImportarMultiplaAssociacao")]
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
                    var config = new CsvConfiguration(CultureInfo.InvariantCulture)
                    {
                        HasHeaderRecord = false,
                        Delimiter = "|",
                        NewLine = "\n"
                    };
                    using (var reader = new StreamReader(arquivo.OpenReadStream()))
                    using (var csv = new CsvReader(reader, config))
                    {
                        cancellationToken.ThrowIfCancellationRequested();
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
                            cancellationToken.ThrowIfCancellationRequested();
                            var value = csv.GetRecord<BaseMultiplaAssociacao>();
                            // Verificar se o cabeçalho já foi validado
                            if (!cabecalhoValido)
                            {
                    
                                if (value.UF == "UF" &&
                                    value.Municipio == "Município" &&
                                    value.Estacao == "Estação abastecedora" &&
                                    value.Celula == "Célula" &&
                                    value.Survey == "Survey" &&
                                    value.AssociacaoCDO == "Associação CDO" &&
                                    value.NomeCdo == "Nome CDO" &&
                                    value.DataAssociacao == "Data de associação")
                                {
                                    cabecalhoValido = true;
                                }
                                else
                                {
                                    return BadRequest("CSV incompatível com esse modelo.");
                                }
                            }

                            if (value.UF != "UF" && value.UF != ";")
                            {
                                // Verificar se as entradas já existem
                                bool ignoreKey = await _enderecoTotalRepository.IgnoreKeyMultiplaAssociacao(value);

                                if (!ignoreKey)
                                {
                                                    
                                    var modelo = new EnderecoTotal
                                    {
                                        UF = value.UF,
                                        Municipio = value.Municipio,
                                        SiglaEstacao = value.Estacao,
                                        Celula = value.Celula,
                                        Cod_Survey = value.Survey,
                                        //AssociacaoCDO = value.AssociacaoCDO,
                                        NomeCdo = value.NomeCdo,
                                        //DataAssociacao = value.DataAssociacao,
                                        //ChaveCelula = $"{value.UF}-{value.Estacao}-{value.Celula}",
                                        //Id_MaterialRede = await _enderecoTotalRepository.ChaveEstrangeira(value.UF ?? "", value.Estacao ?? "", value.NomeCdo ?? "")
                                    };

                                    //recupera ID apara atualização 
                                    int surveyExist = await _enderecoTotalRepository.SurveyExistMultiplaAssociacao(value);

                                    if (surveyExist != 0)
                                    {
                                        //atualizar registro no banco de dados
                                        await _enderecoTotalRepository.Editar(surveyExist, modelo);
                                        surveyExist = 0;
                                    }else{
                                        // Inserir um novo registro no banco de dados
                                        await _enderecoTotalRepository.Inserir(modelo);
                                    }
                                    
                                }
                                row++;
                                _progressoRepository.UpdateProgress(true, row, $"Transferindo dados...", totalLinhas);
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
                    cancellationToken.ThrowIfCancellationRequested();
                    return BadRequest("Nenhum arquivo enviado.");
                }
                if (!Path.GetExtension(arquivo.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase))
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    return BadRequest("O arquivo deve estar no formato .csv.");
                }
                else
                {
                    var config = new CsvConfiguration(CultureInfo.InvariantCulture)
                    {
                        HasHeaderRecord =  false,
                        Delimiter = "|",
                        NewLine = "\n"
                    };

                    using (var reader = new StreamReader(arquivo.OpenReadStream(), Encoding.GetEncoding("ISO-8859-1")))
                    using (var csv = new CsvReader(reader, config))
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        // Verifique se o cabeçalho contém os campos esperados
                        var _ColumnNames = new[] { "CELULA", "ESTACAO_ABASTECEDORA", "UF", "MUNICIPIO", "LOCALIDADE", "COD_LOCALIDADE" };
                        
                        if (!csv.Read())
                        {
                            cancellationToken.ThrowIfCancellationRequested();
                            return BadRequest("O arquivo CSV está vazio ou não possui cabeçalho.");
                        }
                        var headerRecord = csv.Parser.Record;
                        var headerValid = _ColumnNames.All(header => headerRecord.Contains(header));

                        if (!headerValid)
                        {
                            cancellationToken.ThrowIfCancellationRequested();
                            return BadRequest("CSV incompatível com esse modelo.");
                        }
                        var surveysProcessed = new Dictionary<string, int>();
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
                            
                            var value = csv.GetRecord<BaseEnderecoTotal>();

                            if (value.CELULA != "CELULA" && value.CELULA != ";")
                            {
                                var _enderecoTotal = await _enderecoTotalRepository.SurveyExistEnderecoTotal(value.COD_SURVEY ?? "");

                                var surveyKey = $"{value.COD_SURVEY}";
                                int _id_StatusGanho = 0;
                                int _id_Disponibilidade = 0;

                                if (surveysProcessed.ContainsKey(surveyKey))
                                {
                                    _id_StatusGanho = 3; 
                                    _id_Disponibilidade = 4;
                                }
                                else
                                {
                                    _id_StatusGanho = GeraStatusGanho(value.COD_VIABILIDADE ?? "", value.DISP_COMERCIAL ?? "");
                                    _id_Disponibilidade = GeraStatusDisponiblidade(value.DISP_COMERCIAL ?? "");
                                    surveysProcessed[surveyKey] = _id_StatusGanho;
                                }

                                // Verificar se as entradas já existem
                                bool ignoreKey = await _enderecoTotalRepository.IgnoreKeyEnderecoTotal(value, _enderecoTotal.AnoMes ?? "");

                                if (!ignoreKey )
                                {
                                    string _celula = PegarCelula(value.CELULA ?? "");
                                    string _sigla = value.ESTACAO_ABASTECEDORA?.Split(';')[0] ?? ""; 
                                    string _anoMes = GeraAnoMes(_id_StatusGanho, _enderecoTotal.AnoMes ?? ""); 
                                    
                                        var modelo = new EnderecoTotal
                                        {
                                            AnoMes = _anoMes,
                                            Id_StatusGanho = _id_StatusGanho,
                                            StatusGanho = GeraGanho(_id_StatusGanho),
                                            Id_Disponibilidade = _id_Disponibilidade,
                                            Disponibilidade = GeraDisponiblidade(_id_Disponibilidade),
                                            UF = value.UF,
                                            SiglaEstacao = _sigla,
                                            Celula = value.CELULA,
                                            Municipio = value.MUNICIPIO,
                                            Localidade = value.LOCALIDADE,
                                            Cod_Localidade = value.COD_LOCALIDADE,
                                            LocalidadeAbrev = value.LOCALIDADE_ABREV,
                                            Logradouro = value.LOGRADOURO,
                                            Cod_Survey = value.COD_SURVEY,
                                            Cod_Logradouro = value.COD_LOGRADOURO,
                                            NumeroFachada = value.NUM_FACHADA,
                                            Complemento = value.COMPLEMENTO,
                                            ComplementoDois = value.COMPLEMENTO2,
                                            ComplementoTres = value.COMPLEMENTO3,
                                            CEP = value.CEP,
                                            Bairro = value.BAIRRO,
                                            NomeCdo = value.NOME_CDO,
                                            QuantidadeUMS = int.Parse(value.QUANTIDADE_UMS ?? ""),
                                            Cod_Viabilidade = value.COD_VIABILIDADE,
                                            TipoViabilidade = value.TIPO_VIABILIDADE,
                                            TipoRede = value.TIPO_REDE,
                                            UCS_Residenciais = value.UCS_RESIDENCIAIS,
                                            UCS_Comerciais = value.UCS_COMERCIAIS,
                                            Id_Endereco = value.ID_ENDERECO,
                                            Latitude = value.LATITUDE,
                                            Longitude = value.LONGITUDE,
                                            TipoSurvey = value.TIPO_SURVEY,
                                            RedeInterna = value.REDE_INTERNA,
                                            UMS_Certificadas = value.UMS_CERTIFICADAS,
                                            RedeEdificio_Certificados = value.REDE_EDIF_CERT,
                                            NumeroPiso = value.NUM_PISOS,
                                            Disp_Comercial = value.DISP_COMERCIAL,
                                            Id_Celula = value.ID_CELULA,
                                            EstadoControle = value.ESTADO_CONTROLE,
                                            DataEstadoControle = value.DATA_ESTADO_CONTROLE,
                                            Quantidade_HCS = value.QUANTIDADE_HCS,
                                            Projeto = value.PROJETO,
                                            ChaveCelula = $"{value.UF}-{_sigla}-{_celula}",
                                            Id_MaterialRede = await _enderecoTotalRepository.ChaveEstrangeira(value.UF ?? "", _sigla, value.NOME_CDO ?? "")
                                            

                                        };

                                        //recupera ID apara atualização 
                                        int surveyExist = _enderecoTotal.Id_EnderecoTotal;

                                        if (surveyExist != 0)
                                        {
                                            //atualizar registro no banco de dados
                                            await _enderecoTotalRepository.Editar(surveyExist, modelo);
                                            surveyExist = 0;

                                        }else{
                                            // Inserir um novo registro no banco de dados
                                            await _enderecoTotalRepository.Inserir(modelo);

                                        }
                                    
                                }
                                cancellationToken.ThrowIfCancellationRequested();
                                row++;
                                _progressoRepository.UpdateProgressBase(true, row, $"Transferindo dados...", totalLinhas);
                            }
                        }
                        return Ok("CSV importada com sucesso!");
                    }
                }
            }
            catch (Exception ex)
            {
                cancellationToken.ThrowIfCancellationRequested();
                return BadRequest($"Ocorreu um erro ao importar a CSV.{ex.StackTrace}");
            }

        }

        private string PegarCelula (string celula){
            string pattern = @"^\d+";  

            Match match = Regex.Match(celula, pattern);
            if (match.Success)
            {
                return match.Value;
            }
            else
            {
                return "";
            }
        }

        private int GeraStatusGanho(string cod_Viabilidade, string disponibilidade){
                if(cod_Viabilidade == "0"){
                    return 1;

                }else if((cod_Viabilidade == "2" || cod_Viabilidade == "4") && disponibilidade == "Sim"){
                    return 1;

                }else{
                    return 2;

                }
            
        }
        private string GeraGanho(int statusGanho){
                if(statusGanho == 1){
                    return "COM GANHO";

                }else if(statusGanho == 2){
                    return "SEM GANHO";

                }else{
                    return "SEM GANHO";

                }
            
        }

        private int GeraStatusDisponiblidade(string disponibilidade){
            if(disponibilidade == "Sim"){
                return 1;

            }else if(disponibilidade == "Não"){
                return 2;

            }else{
                return 3;

            }
        }
        private string GeraDisponiblidade(int disponibilidade){
            if(disponibilidade == 1){
                return "ATIVA";

            }else if(disponibilidade == 2){
                return "INATIVA";

            }else{
                return "F. DA CÉLULA";

            }
        }

        private string GeraAnoMes(int statusGanho, string anoMes)
        {
            if(statusGanho == 1 && string.IsNullOrEmpty(anoMes)){
                DateTime dataAtual = DateTime.Now;

                // Obter o número da semana do mês
                int numeroSemana = (dataAtual.Day - 1) / 7 + 1;

                // Obter o ano e o mês no formato necessário
                string ano = dataAtual.ToString("yyyy");
                string mes = dataAtual.ToString("MM");

                // Formatar a string final
                return $"{ano}{mes}S{numeroSemana}";

            }else if (statusGanho == 1 && !string.IsNullOrEmpty(anoMes)){
                return anoMes;

            }else{
                return "";

            }
        }*/

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