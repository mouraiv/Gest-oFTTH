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

         public async Task<Info> CarregarId(int? id_Info)
        {
            try
            {
                return await _context.Infos
                        .AsNoTracking()
                           .Where(p => p.Id_info== id_Info)
                           .FirstOrDefaultAsync() ?? new Info(); 
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
            
        }
        public async Task<bool> Deletar(int id)
        {
            try
            {
                Info db = await CarregarId(id);

                _context.Infos.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Info> Editar(int id, Info info)
        {
            try
            {
                Info db = await CarregarId(id);

                db.Base = info.Base;
                db.DataImport = info.DataImport;
                db.Atualizar = info.Atualizar;
            
                _context.Infos.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.StackTrace);
            }
        }

        public async Task<Info> Inserir(Info info)
        {
            try
            {
                _context.Infos.Add(info);
                await _context.SaveChangesAsync();
                return info;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
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
