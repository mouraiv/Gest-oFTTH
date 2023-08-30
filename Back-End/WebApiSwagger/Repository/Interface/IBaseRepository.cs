namespace WebApiSwagger.Repository.Interface
{
    public interface IBaseRepository
    {
        void UploadArquivo(List<IFormFile> path, string uf, string unidade, string cdo, string cdoia);
        List<string> ListarArquivo(string uf, string unidade, string cdo, string[] extensoes);
        bool DeletaArquivo(string uf, string unidade, string cdo, string imageName);
    }
}