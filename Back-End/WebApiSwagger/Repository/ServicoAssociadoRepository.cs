using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository
{
    public class ServicoAssociadoRepository : IServicoAssociadoRepository
    {
        private readonly AppDbContext _context;
        public ServicoAssociadoRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServicoAssociado> CarregarId(int? id_ServicoAssociado)
        {
            try
            {
                return await _context.ServicoAssociados
                           .Where(p => p.Id_ServicoAssociados == id_ServicoAssociado)
                           .FirstOrDefaultAsync() ?? new ServicoAssociado(); 
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
                ServicoAssociado db = await CarregarId(id);

                _context.ServicoAssociados.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<ServicoAssociado> Editar(int id, ServicoAssociado servicoAssociado)
        {
            try
            {
                ServicoAssociado db = await CarregarId(id);

                db.EstadoHSI = servicoAssociado.EstadoHSI;
                db.EstadoAcessoGPON = servicoAssociado.EstadoAcessoGPON;
                db.EstadoProvPortaFisica = servicoAssociado.EstadoProvPortaFisica;
                db.CFSAcessoGPON = servicoAssociado.CFSAcessoGPON;
                db.CodigoSurvey = servicoAssociado.CodigoSurvey;
                db.Id_EnderecoTotal = servicoAssociado.Id_EnderecoTotal;
            
                _context.ServicoAssociados.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<ServicoAssociado> Inserir(ServicoAssociado servicoAssociado)
        {
            try
            {
                _context.ServicoAssociados.Add(servicoAssociado);
                await _context.SaveChangesAsync();
                return servicoAssociado;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }
        public async Task<IEnumerable<ServicoAssociado>> Listar(string survey)
        {
            try
            {
                return await _context.ServicoAssociados
                .Where(p => p.CodigoSurvey == survey)
                .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}
