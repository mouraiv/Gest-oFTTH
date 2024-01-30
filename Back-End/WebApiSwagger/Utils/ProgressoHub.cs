// ProgressHub.cs
using Microsoft.AspNetCore.SignalR;

public class ProgressoHub : Hub
{
    public async Task SendProgress(bool start, int contador, string descricao, int total)
    {
        await Clients.All.SendAsync("ReceiveProgress", start, contador, descricao, total);
    }
}