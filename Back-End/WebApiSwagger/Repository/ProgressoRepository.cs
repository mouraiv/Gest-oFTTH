using Microsoft.AspNetCore.SignalR;
using WebApiSwagger.Models;

public class ProgressoRepository : IProgressoRepository
{
    private readonly IHubContext<ProgressoHub> _hubContext;

    public ProgressoRepository(IHubContext<ProgressoHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async void UpdateProgress(bool start, int contador, string descricao, int total)
    {
        var progressModel = new Progresso { 
            Start = start,
            Contador = contador,
            Descricao = descricao,
            Total = total
            };
               
        await _hubContext.Clients.All.SendAsync("ReceiveProgress", progressModel);
    }
}