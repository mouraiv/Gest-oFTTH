using System.Net;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Filters;
using WebApiSwagger.Models.ViewModel;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class BaseRepository : IBaseRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
      
        public BaseRepository(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        
        public void UploadArquivo(List<IFormFile> path, [FromQuery] FiltroImagem filter)
        {
            try
            {
                /*string _caminho = $"{ftpServer}{pastaDoProjeto}";

                // Cria diretórios remotos se não existirem
                CriarDiretorioRemoto($"{_caminho}{filter.UF?.ToUpper()}/");
                CriarDiretorioRemoto($"{_caminho}{filter.UF?.ToUpper()}/{filter.Estacao?.ToUpper()}/");
                CriarDiretorioRemoto($"{_caminho}{filter.UF?.ToUpper()}/{filter.Estacao?.ToUpper()}/TESTE_OPTICO/");

                string caminho = "";
                
                if(filter.CDOIA == null) {
                    caminho = CriarDiretorioRemoto($"{_caminho}{filter.UF?.ToUpper()}/{filter.Estacao?.ToUpper()}/TESTE_OPTICO/{filter.CDO?.ToUpper()}/");
                } else {
                    CriarDiretorioRemoto($"{_caminho}{filter.UF?.ToUpper()}/{filter.Estacao?.ToUpper()}/TESTE_OPTICO/{filter.CDO?.ToUpper()}/"); 
                    caminho = CriarDiretorioRemoto($"{_caminho}{filter.UF?.ToUpper()}/{filter.Estacao?.ToUpper()}/TESTE_OPTICO/{filter.CDO?.ToUpper()}/{filter.CDOIA?.ToUpper()}/");
                }

                // Envia o arquivo para o servidor FTP
                using (WebClient client = new WebClient())
                {    
                    
                    foreach (var file in path)
                    {
                        if (file != null && file.Length > 0)
                        {

                            // Obtém a extensão do arquivo original
                            var fileExtension = Path.GetExtension(file.FileName);

                            //Renomear aquivos para uptload
                            string name = filter.CDOIA != null ? $"{filter.CDOIA?.ToUpper().Replace("-","_")}_{DateTime.Now.Ticks}{fileExtension}" :
                            $"{filter.CDO?.ToUpper().Replace("-","_")}_{DateTime.Now.Ticks}{fileExtension}";

                            // Salva o arquivo no diretório criado
                            var filePath = $"{caminho}{name}";

                            using (var stream = file.OpenReadStream())
                            {
                                //Autenticar FTP server
                                client.Credentials = new NetworkCredential(ftpUsername, ftpPassword);

                                // Faz upload diretamente para o FTP
                                client.UploadData($"{filePath}", "STOR", LerBytesDoStream(stream));
                            }

                            }
                        }
                    }*/
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
                string caminhoDiretorio = Path.Combine(@"\\192.168.0.204\Grandes Clientes\Controle de Gestão FTTH\anexos", filter.Estacao?.ToUpper() ?? "", "TESTE_OPTICO", filter.CDO?.ToUpper() ?? "");

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

                            // Adicione o objeto ArquivoView à lista
                            arquivosImagem.Add(new ArquivoView
                            {
                                Caminho = arquivo,
                                Bytes = $"data:{type};base64,{Convert.ToBase64String(bytes)}"
                            });
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
            string[] extensoesPermitidas = { ".jpg", ".jpeg", ".png", ".gif", ".jfif", ".bmp", ".dwg" };
            return extensoesPermitidas.Contains(extensao.ToLower());
        }

        public bool DeletaArquivo(string url){

            try
            {
                /*string _url = url.Replace("http://192.168.4.10/dataftpd/","ftp://192.168.4.10//Front-End/dataftpd");
                WebRequest request = WebRequest.Create(_url);
                request.Method = WebRequestMethods.Ftp.DeleteFile;
                request.Credentials = new NetworkCredential(ftpUsername, ftpPassword);

                using (var resp = (FtpWebResponse)request.GetResponse())
                {
                    Debug.WriteLine($"Arquivo excluído com sucesso.");
                    return true;
                }*/
                return false;
            }
            catch (WebException ex)
            {
                throw new Exception("Ocorreu um erro ao excluir o arquivo: " + ex.Message);
            }
        }
    }
}