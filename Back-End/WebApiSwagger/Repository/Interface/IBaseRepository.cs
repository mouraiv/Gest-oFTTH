using WebApiSwagger.Filters;

namespace WebApiSwagger.Repository.Interface
{
    public interface IBaseRepository
    {
        void UploadArquivo(List<IFormFile> path, FiltroImagem filter);
        List<string> ListarArquivo(FiltroImagem filter, string[] extensoes);
        bool DeletaArquivo(FiltroImagem filter);
    }
}