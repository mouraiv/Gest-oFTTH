using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Controllers
{
    [Route("Base")]
    public class BaseController : Controller
    {
        private readonly Visualizador _visualizador;

        public BaseController(Visualizador visualizador)
        {
            _visualizador = visualizador;
        }

        [HttpGet("DownloadsModelo")]
        public IActionResult DownloadsModelo()
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

        [HttpPost("UploadImagem")]
        [Consumes("multipart/form-data")]
        public IActionResult UploadImagem(List<IFormFile> path, string uf, string unidade, string cdo, string cdoia)
        {
            try
            {
                if (path == null || path.Count == 0)
                {
                    return NotFound("Nenhuma imagem foi enviada.");
                }

                _visualizador.UploadImagem(path, uf, unidade, cdo, cdoia);

                return Ok("Upload concluído com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest("Erro ao carregar upload: " + ex.Message);
            }
        }

        [HttpGet("VisualizarImagem")]
        public IActionResult VisualizarImagem(string uf, string unidade, string cdo)
        { 
            try
            {
                var imagems = _visualizador.CarregarVisualizador(uf, unidade, cdo, new string[] { ".jpg", ".png", ".jfif", ".bmp" });  

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

        [HttpDelete("DeletarImagem")]
        public IActionResult DeletarImagem(string uf, string unidade, string cdo, string imageName)
        { 
            try
            {
                bool delete = _visualizador.DeletaImagem(uf, unidade, cdo, imageName);

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