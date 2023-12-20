using WebApiSwagger.Filters;

namespace WebApiSwagger.Repository.Interface
{
    public interface IBaseRepository
    {
        void UploadArquivo(List<IFormFile> path, FiltroImagem filter);
        List<string> ListarArquivo(FiltroImagem filter);
        bool DeletaArquivo(string url);
    }
}