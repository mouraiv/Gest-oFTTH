using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;
using WebApiSwagger.Models;
using WebApiSwagger.Models.Base;
using CsvHelper.Configuration;
using System.Text;
using CsvHelper;
using System.Globalization;

namespace WebApiSwagger.Controllers
{
     [ApiController]
    [Route("Api/MaterialRede")]
    public class MaterialRedeController : Controller
    {
        private readonly IMaterialRedeRepository _materialRedeRepository;
        private readonly IProgressoRepository _progressoRepository;

        public MaterialRedeController(IMaterialRedeRepository materialRedeRepository, IProgressoRepository progressoRepository)
        {
            _materialRedeRepository = materialRedeRepository;
            _progressoRepository = progressoRepository;

        }
        [HttpGet("Carregar")]
        public async Task<IActionResult> Carregar([FromQuery] int id)
        {
            try
            {
                var resultado = await _materialRedeRepository.CarregarId(id);

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
        [HttpGet("ListaUnica")]
        public async Task<IActionResult> ListaUnica([FromQuery] 
            string? uf, 
            string? sigla,
            string? estacao,
            string? bairro,
            string? municipio
            )
        {
            try
            {

                var resultado = await _materialRedeRepository.ListaUnica(
                    uf ?? "", 
                    sigla ?? "",
                    estacao ?? "",
                    bairro ?? "",
                    municipio ?? ""
                    );

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

        /*[HttpPost("ImportarMaterialRede")]
        [RequestSizeLimit(10_000_000_000)]
        public async Task<IActionResult> ImportarMaterialRede(IFormFile arquivo, CancellationToken cancellationToken)
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
                            
                            var value = csv.GetRecord<BaseMaterialRede>();

                            if (value.SiglaUnidadeFederativa != "CELULA" && value.SiglaUnidadeFederativa != ";")
                            {
                                var _enderecoTotal = await _enderecoTotalRepository.SurveyExistEnderecoTotal(value.COD_SURVEY ?? "");

                                // Verificar se as entradas já existem
                                bool ignoreKey = await _enderecoTotalRepository.IgnoreKeyEnderecoTotal(value, _enderecoTotal.AnoMes ?? "");

                                if (!ignoreKey )
                                {
                                    
                                        var modelo = new MaterialRede
                                        {
                                            
                                                                                        

                                        };

                                        //recupera ID apara atualização 
                                        int surveyExist = _enderecoTotal.Id_EnderecoTotal;

                                        if (surveyExist != 0)
                                        {
                                            //atualizar registro no banco de dados
                                            await _materialRedeRepository.Editar(surveyExist, modelo);
                                            surveyExist = 0;

                                        }else{
                                            // Inserir um novo registro no banco de dados
                                            await _materialRedeRepository.Inserir(modelo);

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

        }*/
    }
}