using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class BaseRepository : IBaseRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string pastaDoProjeto;
        private readonly string ftpServer;
        private readonly string ftpUsername;
        private readonly string ftpPassword;
        public BaseRepository(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            pastaDoProjeto = $"/Front-End/dataftpd/GestaoFTTH/TesteOptico/Uploads/Anexos/";
            ftpServer = "ftp://192.168.4.10/";
            ftpUsername = "mouraiv";
            ftpPassword = "Wes2485";
        }
        
        public void UploadArquivo(List<IFormFile> path, [FromQuery] FiltroImagem filter)
        {
            try
            {
                string _caminho = $"{ftpServer}{pastaDoProjeto}";

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
                    }
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro no upload do arquivo: " + ex.Message);
            }
        }

        private string CriarDiretorioRemoto(string caminhoRemoto)
        {
            if (!DiretorioRemotoExiste(caminhoRemoto))
            {
                try
                {
                    WebRequest request = WebRequest.Create(caminhoRemoto);
                    request.Method = WebRequestMethods.Ftp.MakeDirectory;
                    request.Credentials = new NetworkCredential(ftpUsername, ftpPassword);

                    using (var resp = (FtpWebResponse) request.GetResponse())
                    {
                        return caminhoRemoto;
                    }
                }
                catch(Exception ex)
                {
                    throw new Exception("Ocorreu um erro no upload do arquivo: " + ex.Message);
                }
            } else {

                return caminhoRemoto;
            }
        }
        private bool DiretorioRemotoExiste(string caminhoRemoto)
        {
            try
            {
                WebRequest request = WebRequest.Create(caminhoRemoto);
                request.Method = WebRequestMethods.Ftp.ListDirectory;
                request.Credentials = new NetworkCredential(ftpUsername, ftpPassword);

                using (var resp = (FtpWebResponse)request.GetResponse())
                {
                    return true; // O diretório existe
                }
            }
            catch (WebException ex)
            {
                FtpWebResponse response = (FtpWebResponse)ex.Response;

                if (response.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                {
                    return false; // O diretório não existe
                }
                else
                {
                    throw new Exception("Ocorreu um erro: " + ex.Message);
                }
            }
        }
        private static byte[] LerBytesDoStream(Stream stream)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                stream.CopyTo(ms);
                return ms.ToArray();
            }
        }
        public List<string> ListarArquivo(FiltroImagem filter)
        {
            string caminhoRelativo = $"/Front-End/dataftpd/GestaoFTTH/TesteOptico/Uploads/Anexos/{filter.UF?.ToUpper()}/{filter.Estacao?.ToUpper()}/TESTE_OPTICO/{filter.CDO?.ToUpper()}/";

            var request = (FtpWebRequest)WebRequest.Create(new Uri(new Uri($"{ftpServer}"), caminhoRelativo));
            request.Method = WebRequestMethods.Ftp.ListDirectory;
            request.Credentials = new NetworkCredential(ftpUsername, ftpPassword);

            try
            {
                using (var response = (FtpWebResponse)request.GetResponse())
                using (var streamReader = new StreamReader(response.GetResponseStream()))
                {
                    // Lê a lista de nomes de arquivos do diretório
                    string listaArquivos = streamReader.ReadToEnd();

                    // Separa a lista em uma matriz de nomes de arquivos
                    string[] linhas = listaArquivos.Split(new char[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

                    List<string> urls = new List<string>();

                    foreach (var linha in linhas)
                    {
                        string nome = linha.Trim();
                        // Constrói o caminho completo do arquivo ou diretório
                        string caminhoCompleto = $"{caminhoRelativo}{nome}";

                        string padrao = @"\.(jpg|jpeg|gif|png|bmp|jfif|dwg)$";

                        // Verificar se a string corresponde ao padrão
                        bool corresponde = Regex.IsMatch(nome, padrao);

                        if (corresponde)
                        {
                            if(ExtensaoPermitida(nome, new string[] { ".jpg", ".jpeg", ".png", ".gif", ".jfif", ".bmp", ".dwg" })) {
                            // Se for um arquivo, constrói a URL e adiciona à lista
                            urls.Add(ConstruirUrlImagem(caminhoCompleto));

                            }
                        }
                        else
                        {
                            urls.AddRange(ListarArquivosRecursivamente(filter, caminhoCompleto));
                        }

                    }

                    return urls;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar a visualização: " + ex.Message);
            }
        }

        private List<string> ListarArquivosRecursivamente(FiltroImagem filter, string caminhoRelativo)
        {
            try
            {
                List<string> urls = new();

                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(new Uri(new Uri($"{ftpServer}"), caminhoRelativo));
                request.Method = WebRequestMethods.Ftp.ListDirectoryDetails; // Obter detalhes para identificar se é um diretório ou arquivo
                request.Credentials = new NetworkCredential(ftpUsername, ftpPassword);

                using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
                using (Stream responseStream = response.GetResponseStream())
                using (StreamReader streamReader = new(responseStream))
                {
                    // Lê a lista de detalhes do diretório
                    string listaDetalhes = streamReader.ReadToEnd();

                    // Separa a lista em uma matriz de linhas
                    string[] linhas = listaDetalhes.Split(new char[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

                    foreach (var linha in linhas)
                    {
                        //REGEX DE EXTRAÇÃO
                        string padrao = @"\d{2}:\d{2}\s+(.+)$";
                        // Se encontrar um espaço, extrai o nome após o espaço
                        Match correspondencia = Regex.Match(linha, padrao);
                        
                        string _nome = correspondencia.Success ? correspondencia.Groups[1].Value : string.Empty;

                        var ehDiretorio = linha;
                        // Constrói o caminho completo do arquivo ou diretório
                        string caminhoCompleto = $"{caminhoRelativo}/{_nome}";

                        if(ExtensaoPermitida(_nome, new string[] { ".jpg", ".jpeg", ".png", ".gif", ".jfif", ".bmp", ".dwg" })) {
                            // Se for um arquivo, constrói a URL e adiciona à lista
                            urls.Add(ConstruirUrlImagem(caminhoCompleto));

                        }

                    }
                }

                return urls;
          
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar a visualização recursiva: " + ex.Message);
            }
        }

        private bool ExtensaoPermitida(string nomeArquivo, string[] extensoes)
        {
            string extensao = Path.GetExtension(nomeArquivo).ToLower();
            return extensoes.Contains(extensao);
        }

        private static string ConstruirUrlImagem(string nomeArquivo)
        {
            var scheme = "http";
            var host = "192.168.4.10/dataftpd/";

            return $"{scheme}://{host}{nomeArquivo.Replace("/Front-End/dataftpd","")}";
        }

        public bool DeletaArquivo(string url){

            try
            {
                string _url = url.Replace("http://192.168.4.10/dataftpd/","ftp://192.168.4.10//Front-End/dataftpd");
                WebRequest request = WebRequest.Create(_url);
                request.Method = WebRequestMethods.Ftp.DeleteFile;
                request.Credentials = new NetworkCredential(ftpUsername, ftpPassword);

                using (var resp = (FtpWebResponse)request.GetResponse())
                {
                    Debug.WriteLine($"Arquivo excluído com sucesso.");
                    return true;
                }
            }
            catch (WebException ex)
            {
                throw new Exception("Ocorreu um erro ao excluir o arquivo: " + ex.Message);
            }
        }
    }
}