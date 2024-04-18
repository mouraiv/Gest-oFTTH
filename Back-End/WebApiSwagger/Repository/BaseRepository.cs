using WebApiSwagger.Context;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Filters;
using WebApiSwagger.Models.ViewModel;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class BaseRepository : IBaseRepository
    {
        private readonly AppDbContext _context;
        
        private readonly string server;
      
        public BaseRepository(AppDbContext context)
        {
            _context = context;
            
            // Recuperar o caminho do diretório do banco de dados
            var diretorio = _context.Diretorios.FirstOrDefault();
            if (diretorio != null)
            {
                server = diretorio.Caminho ?? "";
            }
            else
            {
                server = "";
            }
        }
        
        public void UploadArquivo(List<IFormFile> path, [FromQuery] FiltroImagem filter)
        {
            try
            {
                // Construa o caminho completo para o diretório no servidor
                string caminhoDiretorio = Path.Combine(server, filter.UF?.ToUpper() ?? "", filter.Estacao?.ToUpper() == "NULL" ? "SN" : filter.Estacao?.ToUpper() ?? "", "TESTE_OPTICO", filter.CDO?.ToUpper() ?? "", filter.CDOIA?.ToUpper() ?? "");

                // Verifique se o diretório existe e crie-o se não existir
                if (!Directory.Exists(caminhoDiretorio) || !string.IsNullOrEmpty(filter.CDOIA))
                {
                    Directory.CreateDirectory(caminhoDiretorio);
                }

                // Faça o upload de cada arquivo para o diretório no servidor
                foreach (var arquivo in path)
                {
                    if (arquivo != null && arquivo.Length > 0)
                    {
                        // Obtém a extensão do arquivo original
                        var extensaoArquivo = Path.GetExtension(arquivo.FileName);

                        // Renomeia o arquivo para evitar colisões de nomes
                        string nomeArquivo = !string.IsNullOrEmpty(filter.CDOIA) ? 
                        $"{filter.CDOIA}_{DateTime.UtcNow.Ticks}{extensaoArquivo}" : $"{filter.CDO}_{DateTime.UtcNow.Ticks}{extensaoArquivo}";

                        // Construa o caminho completo para o arquivo no servidor
                        string caminhoArquivo = Path.Combine(caminhoDiretorio, nomeArquivo);

                        // Salva o arquivo no disco do servidor
                        using (var stream = new FileStream(caminhoArquivo, FileMode.Create))
                        {
                            arquivo.CopyTo(stream);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro no upload do arquivo: " + ex.Message);
            }
        }
       
        public List<ArquivoView> ListarArquivo(FiltroImagem filter)
        {
            List<ArquivoView> arquivosImagem = new List<ArquivoView>();

            try
            {
                // Construa o caminho completo para o diretório de rede
                string caminhoDiretorio = Path.Combine(server, filter.UF?.ToUpper() ?? "",  filter.Estacao?.ToUpper() ?? "", "TESTE_OPTICO", filter.CDO?.ToUpper() ?? "");

               if (Directory.Exists(caminhoDiretorio))
                {
                    // Obtenha uma lista de arquivos no diretório e suas subpastas
                    string[] arquivos = Directory.GetFiles(caminhoDiretorio, "*", SearchOption.AllDirectories);

                    // Itere sobre os arquivos encontrados
                    foreach (string arquivo in arquivos)
                    {
                        // Verifique se o arquivo possui uma extensão de imagem permitida
                        string extensao = Path.GetExtension(arquivo);
                        if (ExtensaoPermitida(extensao))
                        {
                            // Leia o arquivo como array de bytes
                            byte[] bytes = File.ReadAllBytes(arquivo);

                            // Determine o tipo MIME da imagem
                            string type = "image/jpeg"; // Tipo MIME padrão
                            if (extensao.EndsWith(".jpg") || extensao.EndsWith(".jpeg"))
                                type = "image/jpeg";
                            else if (extensao.EndsWith(".png"))
                                type = "image/png";
                            else if (extensao.EndsWith(".gif"))
                                type = "image/gif";
                            else if (extensao.EndsWith(".jfif"))
                                type = "image/jpeg";
                            else if (extensao.EndsWith(".bmp"))
                                type = "image/bmp";
                            else if (extensao.EndsWith(".dwg"))
                                type = "image/vnd.dwg";
                            else if (extensao.EndsWith(".sor")) 
                                type = "application/octet-stream"; 
                            else if (extensao.EndsWith(".msor")) 
                                type = "application/octet-stream";    

                            // Adicione o objeto ArquivoView à lista
                            if(type == "application/octet-stream"){
                                arquivosImagem.Add(new ArquivoView
                                {
                                    Caminho = arquivo,
                                    Bytes = Convert.ToBase64String(bytes)
                                });
                            }
                            else
                            {
                                arquivosImagem.Add(new ArquivoView
                                {
                                    Caminho = arquivo,
                                    Bytes = $"data:{type};base64,{Convert.ToBase64String(bytes)}"
                                });
                            }
                        }
                    }
                }
                else
                {
                    Console.WriteLine("O diretório não existe: " + caminhoDiretorio);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar a visualização: " + ex.Message);
            }
            return arquivosImagem;
        }

        private bool ExtensaoPermitida(string extensao)
        {
            string[] extensoesPermitidas = { ".jpg", ".jpeg", ".png", ".gif", ".jfif", ".bmp"};
            return extensoesPermitidas.Contains(extensao.ToLower());
        }

        public bool DeletaArquivo(string url){

            try
            {
                // Verifique se o arquivo existe antes de excluí-lo
                if (File.Exists(url))
                {
                    // Exclui o arquivo
                    File.Delete(url);
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Ocorreu um erro ao excluir o arquivo: {ex.Message}");
            }
        }
    }
}