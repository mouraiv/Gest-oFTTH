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
                string caminho = $"{pastaDoProjeto}\\{filter.UF?.ToUpper()}\\{filter.Estacao?.ToUpper()}\\TESTE_OPTICO\\{filter.CDO?.ToUpper()}\\";

                foreach (var file in path)
                {
                    if (file != null && file.Length > 0)
                    {

                        // Verifica se a pasta de destino já existe
                        var folderPath = filter.CDOIA != null ?
                            Path.Combine(caminho.Replace($"{filter.CDOIA?.ToUpper()}\\",""), filter.CDOIA?.ToUpper() ?? "") :
                            Path.Combine(caminho.Replace($"{filter.CDO?.ToUpper()}\\",""), filter.CDO?.ToUpper() ?? "");

                        if (!Directory.Exists(folderPath))
                        {
                            Directory.CreateDirectory(folderPath); // Cria a pasta se não existir
                        }

                        // Obtém a extensão do arquivo original
                        var fileExtension = Path.GetExtension(file.FileName);

                        //Renomear aquivos para uptload
                        string name = filter.CDOIA != null ? $"{filter.CDOIA?.ToUpper()}_{DateTime.Now.Ticks}{fileExtension}" :
                        $"{filter.CDO?.ToUpper()}_{DateTime.Now.Ticks}{fileExtension}";

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
                    .Select(file =>
                    { 
                        var relativePath = file.Replace(caminhoFisico, string.Empty).Replace("\\", "/");
                        return $"{scheme}://{host}/{caminhoRelativo}{relativePath}";
                    })
                    .ToList();
                
                return Arquivos;             
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar a visualização: " + ex.Message);
            }
        }

        public bool DeletaArquivo(string url){

            string _url = url.Replace("/","\\");
            string caminho = $"{pastaDoProjeto}\\{_url}";

             if (!File.Exists(caminho))
            {
                return false;
            }

            try
            {
                File.Delete(caminho);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao excluir a imagem: {ex.Message}");
            }
        }
    }
}