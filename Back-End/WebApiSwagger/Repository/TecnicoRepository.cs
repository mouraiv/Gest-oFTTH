using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class TecnicoRepository : ITecnicoRepository
    {
        private readonly AppDbContext _context;
        public TecnicoRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<Tecnico> CarregarId(int id)
        {
            try
            {
                return await _context.Tecnicos
                           .Where(p => p.Id_Tecnico == id)
                           .FirstOrDefaultAsync() ?? new Tecnico(); 
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
                Tecnico db = await CarregarId(id);

                _context.Tecnicos.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Tecnico> Editar(int id, Tecnico Tecnico)
        {
            try
            {
                Tecnico db = await CarregarId(id);

                db.Nome = Tecnico.Nome;
                db.Email = Tecnico.Email;
                db.Id_Cargo = Tecnico.Id_Cargo;
                db.Id_Empresa = Tecnico.Id_Empresa;
                db.Id_Tecnico = Tecnico.Id_Tecnico;
            
                _context.Tecnicos.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<Tecnico> Inserir(Tecnico Tecnico)
        {
            try
            {
                _context.Tecnicos.Add(Tecnico);
                await _context.SaveChangesAsync();
                return Tecnico;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<Tecnico>> Listar()
        {
             try
            {
                return await _context.Tecnicos
                    .Include(p => p.GetEmpresa)
                    .Include(p => p.GetCargo)
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}