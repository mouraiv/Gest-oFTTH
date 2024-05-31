using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Repository
{
    public class LigacaoRepository : ILigacaoRepository
    {
        private readonly AppDbContext _context;
        public LigacaoRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<Ligacao> CarregarId(int? id_Ligacao)
        {
            try
            {
                return await _context.Ligacoes
                           .Where(p => p.Id_Ligacao == id_Ligacao)
                           .FirstOrDefaultAsync() ?? new Ligacao(); 
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
                Ligacao db = await CarregarId(id);

                _context.Ligacoes.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<Ligacao> Editar(int id, Ligacao ligacao)
        {
            try
            {
                Ligacao db = await CarregarId(id);

                db.UF_ls = ligacao.UF_ls;
                db.Municipio_ls = ligacao.Municipio_ls;
                db.Localidade_ls = ligacao.Localidade_ls;
                db.Projeto_ls = ligacao.Projeto_ls;
                db.Celula_ls = ligacao.Celula_ls;
                db.CaboPrimario_ls = ligacao.CaboPrimario_ls;
                db.CaboSecundario_ls = ligacao.CaboSecundario_ls;
                db.Infraestrutura_ls = ligacao.Infraestrutura_ls;
                db.SiglaEstacao_ls = ligacao.SiglaEstacao_ls;
                db.ICX_ls = ligacao.ICX_ls;
                db.NomeOlt_ls = ligacao.NomeOlt_ls;
                db.PortaOlt_ls = ligacao.PortaOlt_ls;
                db.BSP_ls = ligacao.BSP_ls;
                db.DGO_ls = ligacao.DGO_ls;
                db.FibraDgo_ls = ligacao.FibraDgo_ls;
                db.CaboDgo_ls = ligacao.CaboDgo_ls;
                db.SplitterCEOS_ls = ligacao.SplitterCEOS_ls;
                db.OutSplitterCEOS_ls = ligacao.OutSplitterCEOS_ls;
                db.CaboCdo_ls = ligacao.CaboCdo_ls;
                db.FibraCdo_ls = ligacao.FibraCdo_ls;
                db.PortaCdo_ls = ligacao.PortaCdo_ls;
                db.SPLITTER_CDO = ligacao.SPLITTER_CDO;
                db.CDO_ls = ligacao.CDO_ls;
                db.EtiquetaPadrao_ls = ligacao.EtiquetaPadrao_ls;
                db.ForaPadrao_ls = ligacao.ForaPadrao_ls;
                db.EtiquetaCampo_ls = ligacao.EtiquetaCampo_ls;
                db.IdentificacaoTerceiro_ls = ligacao.IdentificacaoTerceiro_ls;
                db.EtiquetaTerceiro_ls = ligacao.EtiquetaTerceiro_ls;
                db.Rede_ls = ligacao.Rede_ls;
                db.Destinacao_ls = ligacao.Destinacao_ls;
                db.EstadoCicloVida_ls = ligacao.EstadoCicloVida_ls;
                db.Id_MaterialRede = ligacao.Id_MaterialRede;
            
                _context.Ligacoes.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<Ligacao> Inserir(Ligacao ligacao)
        {
            try
            {
                _context.Ligacoes.Add(ligacao);
                await _context.SaveChangesAsync();
                return ligacao;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }
        public async Task<IEnumerable<Ligacao>> ListarCarregarId(int? id_MaterialRede)
        {
            try
            {
                return await _context.Ligacoes
                .Where(p => p.Id_MaterialRede == id_MaterialRede)
                .ToListAsync();             
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao listar: " + ex.Message);
            }
        }
    }
}
