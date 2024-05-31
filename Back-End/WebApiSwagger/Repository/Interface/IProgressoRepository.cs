using WebApiSwagger.Models;

public interface IProgressoRepository
{
    void UpdateProgress(bool start, int contador, string descrição, int total);
    void UpdateProgressBase(bool start, int contador, string descricao, int total);
}