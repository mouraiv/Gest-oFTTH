using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository
{
    public class MaterialRedeRepository : IMaterialRedeRepository
    {
        private readonly AppDbContext _context;
        public MaterialRedeRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<MaterialRede> CarregarId(int? id_MaterialRede)
        {
            try
            {
                var query = await _context.MateriaisRedes
                                .FirstOrDefaultAsync(p => p.Id_MaterialRede == id_MaterialRede) ?? new MaterialRede();

                            await _context.Entry(query)
                                .Reference(p => p.Ligacao)
                                .LoadAsync();    

                            await _context.Entry(query)
                                .Collection(p => p.EnderecoTotal)
                                .LoadAsync();              

                return query;

            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
            
        }
         public async Task<MaterialRede> CarregarChave(string? chave)
        {
            try
            {
                return await _context.MateriaisRedes
                            .FirstOrDefaultAsync(p => p.CHAVE == chave) ?? new MaterialRede();


            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
            
        }
    }
}
