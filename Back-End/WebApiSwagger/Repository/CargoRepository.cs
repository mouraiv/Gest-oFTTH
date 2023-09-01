using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;

namespace WebApiSwagger.Repository.Interface
{
    public class CargoRepository : ICargoRepository
    {
        private readonly AppDbContext _context;
        public CargoRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<Cargo> CarregarId(int id)
        {
            try
            {
                return await _context.Cargos
                           .Where(p => p.Id_Cargo == id)
                           .FirstOrDefaultAsync() ?? new Cargo(); 
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
                Cargo db = await CarregarId(id);

                _context.Cargos.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Cargo> Editar(int id, Cargo Cargo)
        {
            try
            {
                Cargo db = await CarregarId(id);

                db.Nome= Cargo.Nome;
            
                _context.Cargos.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<Cargo> Inserir(Cargo Cargo)
        {
            try
            {
                _context.Cargos.Add(Cargo);
                await _context.SaveChangesAsync();
                return Cargo;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<Cargo>> Listar()
        {
             try
            {
                return await _context.Cargos
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }

    }
}