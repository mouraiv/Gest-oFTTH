using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository
{
    public class MaisDeUmaCDORepository : IMaisDeUmaCDORepository
    {
        private readonly AppDbContext _context;
        public MaisDeUmaCDORepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<MaisDeUmaCDO> CarregarId(int? id_MaisDeUmaCDO)
        {
            try
            {
                return await _context.MaisDeUmaCDOs
                        .AsNoTracking()
                           .Where(p => p.Id_MaisDeUmaCDO == id_MaisDeUmaCDO)
                           .FirstOrDefaultAsync() ?? new MaisDeUmaCDO(); 
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
                MaisDeUmaCDO db = await CarregarId(id);

                _context.MaisDeUmaCDOs.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<MaisDeUmaCDO> Editar(int id, MaisDeUmaCDO maisDeUmaCDO)
        {
            try
            {
                MaisDeUmaCDO db = await CarregarId(id);

                db.UF = maisDeUmaCDO.UF;
                db.Estacao_Mc = maisDeUmaCDO.Estacao_Mc;
                db.Celula_Mc = maisDeUmaCDO.Celula_Mc;
                db.Survey_Mc = maisDeUmaCDO.Survey_Mc;
                db.Associacao_CDO = maisDeUmaCDO.Associacao_CDO;
                db.Nome_CDO = maisDeUmaCDO.Nome_CDO;
                db.Data_de_associacao = maisDeUmaCDO.Data_de_associacao;
                db.Id_EnderecoTotal = maisDeUmaCDO.Id_EnderecoTotal;

            
                _context.MaisDeUmaCDOs.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.StackTrace);
            }
        }

        public async Task<MaisDeUmaCDO> Inserir(MaisDeUmaCDO maisDeUmaCDO)
        {
            try
            {
                _context.MaisDeUmaCDOs.Add(maisDeUmaCDO);
                await _context.SaveChangesAsync();
                return maisDeUmaCDO;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }
        public async Task<IEnumerable<MaisDeUmaCDO>> Listar()
        {
            try
            {
                return await _context.MaisDeUmaCDOs
                .AsNoTracking()
                .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }

        public async Task<int> SurveyExist(string associacao, string survey, string data)
        {
            var result = await _context.MaisDeUmaCDOs
                                .Where(p => p.Associacao_CDO == associacao && p.Survey_Mc == survey && p.Data_de_associacao == data)
                                .Select(p => p.Id_MaisDeUmaCDO)
                                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<bool> IgnoreKey(
            string uf,
            string estacao_Mc,
            string survey_Mc,
            string associacao_CDO,
            string data_de_associacao
        )
        {
            bool result = await _context.MaisDeUmaCDOs
                                .AnyAsync(
                                    p => p.UF == uf && 
                                    p.Estacao_Mc == estacao_Mc && 
                                    p.Survey_Mc == survey_Mc && 
                                    p.Associacao_CDO == associacao_CDO && 
                                    p.Data_de_associacao == data_de_associacao
                                    );
                              
            return result;
        }

    }
}
