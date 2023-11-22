using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository
{
    public class InfoRepository : IInfoRepository
    {
        private readonly AppDbContext _context;
        public InfoRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Info>> Listar()
        {
              try
            {
                return await _context.Infos.ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
                          
        }
    }
}
