using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Repository.Interface;

namespace WebApiSwagger.Repository
{
    public class ValidacaoRepository : IValidacaoRepository
    {
        private readonly AppDbContext _context;
        public ValidacaoRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<Validacao> CarregarId(int id)
        {
            try
            {
                return await _context.Validacoes
                           .Where(p => p.Id_Validacao == id)
                           .FirstOrDefaultAsync() ?? new Validacao(); 
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
                Validacao db = await CarregarId(id);

                _context.Validacoes.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Validacao> Editar(int id, Validacao Validacao)
        {
            try
            {
                Validacao db = await CarregarId(id);

                db.DataValidacao = Validacao.DataValidacao;
                db.Tecnico = Validacao.Tecnico;
                db.Id_TesteOptico = Validacao.Id_TesteOptico;
            
                _context.Validacoes.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<Validacao> Inserir(Validacao Validacao)
        {
            try
            {
                _context.Validacoes.Add(Validacao);
                await _context.SaveChangesAsync();
                return Validacao;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<IEnumerable<Validacao>> Listar()
        {
             try
            {
                return await _context.Validacoes
                        .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }

        public async Task<Validacao> VerificarValidacao(int id)
        {
            try
            {
                return await _context.Validacoes
                           .Where(p => p.Id_Validacao == id)
                           .FirstOrDefaultAsync() ?? new Validacao();
            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao verificar a validação: " + ex.Message);
            }
        }

    }
}