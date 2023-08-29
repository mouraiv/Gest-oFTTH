namespace WebApiSwagger.Utils
{
    public class Visualizador
    {
       readonly string pastaDoProjeto = $"{Directory.GetCurrentDirectory()}\\Uploads\\Anexos";

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
                string caminho = $"{pastaDoProjeto}\\{uf.ToUpper()}\\{unidade.ToUpper()}\\TESTE_OPTICO\\";

                foreach (var file in path)
                {
                    if (file != null && file.Length > 0)
                    {

                        // Verifica se a pasta de destino já existe
                        var folderPath = cdoia != null ?
                            Path.Combine(caminho, cdo.ToUpper() + "." + cdoia) :
                            Path.Combine(caminho, cdo.ToUpper());

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
                string caminho = $"{pastaDoProjeto}\\{uf}\\{unidade}\\TESTE_OPTICO\\{cdo}\\";

                var Arquivos = Directory.GetFiles(caminho, "*", SearchOption.AllDirectories)
                            .Where(file => extensoes.Contains(Path.GetExtension(file)))
                            .ToList();

                return Arquivos;             
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar a visualização: " + ex.Message);
            }
        }

        public bool DeletaImagem(string uf, string unidade, string cdo, string imageName){

            string caminho = $"{pastaDoProjeto}\\{uf.ToUpper()}\\{unidade.ToUpper()}\\TESTE_OPTICO\\{cdo.ToUpper()}\\";
            string imagePath = Path.Combine(caminho, imageName);

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