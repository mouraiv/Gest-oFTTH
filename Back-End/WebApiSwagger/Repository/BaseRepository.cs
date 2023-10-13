using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class BaseRepository : IBaseRepository
    {
        readonly string pastaDoProjeto = $"{Directory.GetCurrentDirectory()}\\Uploads\\Anexos";
        private readonly IHttpContextAccessor _httpContextAccessor;
        public BaseRepository(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        
        public void UploadArquivo(List<IFormFile> path, [FromQuery] FiltroImagem filter)
        {
            try
            {
                string caminho = $"{pastaDoProjeto}\\{filter.UF?.ToUpper()}\\{filter.Estacao?.ToUpper()}\\TESTE_OPTICO\\";

                foreach (var file in path)
                {
                    if (file != null && file.Length > 0)
                    {

                        // Verifica se a pasta de destino já existe
                        var folderPath = filter.CDOIA != null ?
                            Path.Combine(caminho, filter.CDO?.ToUpper() + "." + filter.CDOIA) :
                            Path.Combine(caminho, filter.CDO?.ToUpper() ?? "");

                        if (!Directory.Exists(folderPath))
                        {
                            Directory.CreateDirectory(folderPath); // Cria a pasta se não existir
                        }

                        //Renomear aquivos para uptload
                        string name = $"{DateTime.Now.Ticks}-{file.FileName}";

                        // Salva o arquivo no diretório criado
                        var filePath = Path.Combine(folderPath, name);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro no upload do arquivo: " + ex.Message);
            }
        }

        public List<string> ListarArquivo(FiltroImagem filter, string[] extensoes)
        {
            try
            {
                var request = _httpContextAccessor.HttpContext?.Request;
                var scheme = request?.Scheme;
                var host = request?.Host.Value;

                string caminhoRelativo = $"Uploads\\Anexos\\{filter.UF?.ToUpper()}\\{filter.Estacao?.ToUpper()}\\TESTE_OPTICO\\{filter.CDO?.ToUpper()}\\";
                string caminhoFisico = Path.Combine(Environment.CurrentDirectory, caminhoRelativo);

                var Arquivos = Directory.GetFiles(caminhoFisico, "*", SearchOption.AllDirectories)
                    .Where(file => extensoes.Contains(Path.GetExtension(file)))
                    .Select(file => Path.Combine($"{scheme}://{host}", caminhoRelativo, Path.GetFileName(file)))
                    .ToList();
                
                return Arquivos;             
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar a visualização: " + ex.Message);
            }
        }

        public bool DeletaArquivo(FiltroImagem filter){

            string caminho = $"{pastaDoProjeto}\\{filter.UF?.ToUpper()}\\{filter.Estacao?.ToUpper()}\\TESTE_OPTICO\\{filter.CDO?.ToUpper()}\\";
            string imagePath = Path.Combine(caminho, filter.ImageName ?? "");

             if (!Directory.Exists(caminho) || !File.Exists(imagePath))
            {
                return false;
            }

            try
            {
                File.Delete(imagePath);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao excluir a imagem: {ex.Message}");
            }
        }
    }
}