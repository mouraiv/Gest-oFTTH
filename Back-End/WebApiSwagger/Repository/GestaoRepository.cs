using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class GestaoRepository : IGestaoRepository
    {
        private readonly AppDbContext _context;
        public GestaoRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<Gestao> CarregarId(int id)
        {
            try
            {
                return await _context.Gestoes
                           .Where(p => p.Id_Gestao == id)
                           .FirstOrDefaultAsync() ?? new Gestao(); 
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
                Gestao db = await CarregarId(id);

                _context.Gestoes.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Gestao> Editar(int id, Gestao Gestao)
        {
            try
            {
                Gestao db = await CarregarId(id);

                db.Nome = Gestao.Nome;
                db.Email = Gestao.Email;
                db.Id_Cargo = Gestao.Id_Cargo;
                db.Id_Empresa = Gestao.Id_Empresa;
            
                _context.Gestoes.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<Gestao> Inserir(Gestao Gestao)
        {
            try
            {
                _context.Gestoes.Add(Gestao);
                await _context.SaveChangesAsync();
                return Gestao;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<Gestao>> Listar()
        {
             try
            {
                return await _context.Gestoes
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