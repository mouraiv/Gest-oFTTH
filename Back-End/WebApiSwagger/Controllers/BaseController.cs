using WebApiSwagger.Repository.Interface;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;
using WebApiSwagger.Filters;


namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/Base")]
    public class BaseController : Controller
    {
        private readonly IBaseRepository _baseRepository;
        private readonly ConversorDwg _conversorDwg;
        public BaseController(IBaseRepository baseRepository, ConversorDwg conversorDwg)
        {
            _baseRepository = baseRepository;
            _conversorDwg = conversorDwg;
        }

        [HttpGet("DownloadArquivo")]
        public IActionResult DownloadArquivo()
        {
            try
            {
                // Caminho completo para o arquivo XLSX na pasta "Downloads"
                string pastaDoProjeto = Directory.GetCurrentDirectory();
                string filePath = Path.Combine($"{pastaDoProjeto}\\Downloads\\", "TESTES_RECEBIDOS.xlsx");

                // Verifique se o arquivo existe
                if (System.IO.File.Exists(filePath))
                {
                    //Renomear Arquivo Baixado
                    string fileName = $"TESTES_RECEBIDOS_{DateTime.Now:dd/MM/yyyy}.xlsx";
                    // Leia o conteúdo do arquivo
                    byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);

                    // Configurar cabeçalhos de resposta
                    Response.Headers.Add("Content-Disposition", $"inline; filename={fileName}");
                    Response.Headers.Add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

                    // Retorne o arquivo como uma resposta
                    return File(fileBytes.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                }
                else
                {
                    // Arquivo não encontrado, retorne um erro 404 ou outra resposta apropriada
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                
                return BadRequest("Erro no download" + ex.Message); 
            }
        }

        [HttpPost("UploadArquivo")]
        [Consumes("multipart/form-data")]
        public IActionResult UploadArquivo(List<IFormFile> path, [FromQuery] FiltroImagem filter)
        {
            try
            {
                if (path == null || path.Count == 0)
                {
                    return NotFound("Nenhuma imagem foi enviada.");
                }

                foreach (var file in path)
                {
                    if (file.Length > 100 * 1024 * 1024) // Verifica se o tamanho do arquivo é maior que 100MB
                    {
                        return BadRequest("Um ou mais arquivos excedem o tamanho máximo permitido (100MB).");
                    }
                }

                _baseRepository.UploadArquivo(path, filter);

                return Ok("Upload concluído com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest("Erro ao carregar upload: " + ex.Message);
            }
        }

        [HttpGet("VisualizarImagem")]
        public IActionResult VisualizarImagem([FromQuery] FiltroImagem filter)
        { 
            try
            {
                var imagems = _baseRepository.ListarArquivo(filter, new string[] { ".jpg", ".jpeg", ".png", ".jfif", ".bmp", ".dwg" });  

                if (imagems.Count == 0){

                    return NotFound("Nehuma Imagem.");

                }

                return Ok(imagems); 
            }
            catch (Exception ex)
            {
                return BadRequest("Erro na visualização" + ex.Message);                
            }
        }

        [HttpGet("VisualizarDwg")]
        public IActionResult VisualizarDwg(string dwg)
        { 
            try
            {
                if (string.IsNullOrEmpty(dwg)){

                    return NotFound("Nehum Arquivo.");
                }

                _conversorDwg.InputFilePath = dwg;

                _conversorDwg.ConvertFileInBackground();

                return File(_conversorDwg.OutputFilePath, "application/pdf"); 
            }
            catch (Exception ex)
            {
                return BadRequest("Erro na visualização" + ex.Message);                
            }
        }

        [HttpDelete("DeletarArquivo")]
        public IActionResult DeletarArquivo([FromQuery] FiltroImagem filter)
        { 
            try
            {
                bool delete = _baseRepository.DeletaArquivo(filter);

                if (delete == false)
                {
                    return NotFound("Nehuma Imagem.");
                }

                return Ok("Imagem excluída com sucesso.");
            }
            catch (Exception ex)
            {
               return BadRequest("Erro ao excluir" + ex.Message);             
            }
        }
    }
}