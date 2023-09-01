using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class EmpresaRepository : IEmpresaRepository
    {
        private readonly AppDbContext _context;
        public EmpresaRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<Empresa> CarregarId(int id)
        {
            try
            {
                return await _context.Empresas
                           .Where(p => p.Id_Empresa == id)
                           .FirstOrDefaultAsync() ?? new Empresa(); 
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
                Empresa db = await CarregarId(id);

                _context.Empresas.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Empresa> Editar(int id, Empresa empresa)
        {
            try
            {
                Empresa db = await CarregarId(id);

                db.Nome= empresa.Nome;
            
                _context.Empresas.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<Empresa> Inserir(Empresa empresa)
        {
            try
            {
                _context.Empresas.Add(empresa);
                await _context.SaveChangesAsync();
                return empresa;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<Empresa>> Listar()
        {
             try
            {
                return await _context.Empresas
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }

    }
}