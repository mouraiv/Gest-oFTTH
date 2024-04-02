using WebApiSwagger.Filters;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository.Interface
{
    public interface IBaseRepository
    {
        void UploadArquivo(List<IFormFile> path, FiltroImagem filter);
        List<ArquivoView> ListarArquivo(FiltroImagem filter);
        bool DeletaArquivo(string url);
    }
}