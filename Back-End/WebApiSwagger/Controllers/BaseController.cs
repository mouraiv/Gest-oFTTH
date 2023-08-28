using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [Route("Base")]
    public class BaseController : Controller
    {
        [HttpGet("DownloadsModelo")]
        public IActionResult DownloadsModelo()
        {
            // Caminho completo para o arquivo XLSX na pasta "Downloads"
            string pastaDoProjeto = Directory.GetCurrentDirectory();
            string filePath = Path.Combine($"{pastaDoProjeto}\\Downloads\\", "TESTES_RECEBIDOS.xlsx");

            // Verifique se o arquivo existe
            if (System.IO.File.Exists(filePath))
            {
                //Renomear Arquivo Baixado
                string fileName = $"TESTES_RECEBIDOS_{DateTime.Now.ToString("dd/MM/yyyy")}.xlsx";
                // Leia o conteúdo do arquivo
                byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);

                // Configurar cabeçalhos de resposta
                Response.Headers.Add("Content-Disposition", $"inline; filename={fileName}");
                Response.Headers.Add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

                // Retorne o arquivo como uma resposta
                return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }
            else
            {
                // Arquivo não encontrado, retorne um erro 404 ou outra resposta apropriada
                return NotFound();
            }
        }
    }
}