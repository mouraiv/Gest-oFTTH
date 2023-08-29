using Microsoft.AspNetCore.Http.HttpResults;

namespace WebApiSwagger.Utils
{
    public class Visualizador
    {
        public string? FilePath { get; set; }
        public List<string> Arquivos { get; set; } = new List<string>();

        public void UploadImagem
         (  List<IFormFile> path,
            string uf, 
            string unidade, 
            string cdo,
            string cdoia
        )
        {
            try
            {
                string pastaDoProjeto = Directory.GetCurrentDirectory();
                FilePath = $"{pastaDoProjeto}\\Uploads\\Anexos\\{uf.ToUpper()}\\{unidade.ToUpper()}\\TESTE_OPTICO\\";

                foreach (var file in path)
                {
                    if (file != null && file.Length > 0)
                    {
                        
                        // Verifica se a pasta de destino já existe
                        var folderPath = cdoia != null ?
                            Path.Combine(FilePath, cdo.ToUpper() + "." + cdoia) :
                            Path.Combine(FilePath, cdo.ToUpper());

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

        public List<string> CarregarVisualizador
        (   string uf, 
            string unidade, 
            string cdo, 
            string[] extensoes
        )
        {
            try
            {
                string pastaDoProjeto = Directory.GetCurrentDirectory();
                string filePath = $"{pastaDoProjeto}\\Uploads\\Anexos\\{uf}\\{unidade}\\TESTE_OPTICO\\{cdo}\\";

                Arquivos = Directory.GetFiles(filePath, "*", SearchOption.AllDirectories)
                            .Where(file => extensoes.Contains(Path.GetExtension(file)))
                            .ToList();

                return Arquivos;             
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar a visualização: " + ex.Message);
            }
        }
    }
}