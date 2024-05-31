using Microsoft.AspNetCore.SignalR;
using WebApiSwagger.Models;

public class ProgressoRepository : IProgressoRepository
{
    private readonly IHubContext<ProgressoHub> _hubContext;
    private readonly IHubContext<ProgressoHubBase> _hubBaseContext;

    public ProgressoRepository(IHubContext<ProgressoHub> hubContext, IHubContext<ProgressoHubBase> hubBaseContext)
    {
        _hubContext = hubContext;
        _hubBaseContext = hubBaseContext;
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
     public async void UpdateProgressBase(bool start, int contador, string descricao, int total)
    {
        var progressModel = new Progresso { 
            Start = start,
            Contador = contador,
            Descricao = descricao,
            Total = total
            };
               
        await _hubBaseContext.Clients.All.SendAsync("ReceiveProgress", progressModel);
    }
}