using System.Net;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Filters;
using WebApiSwagger.Models.ViewModel;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class DiretorioRepository : IDiretorioRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
       
        public DiretorioRepository(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Task<Diretorio> ReadDiretorio(int id)
        {
            throw new NotImplementedException();
        }
    }
}