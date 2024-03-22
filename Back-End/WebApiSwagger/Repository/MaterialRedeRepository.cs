using WebApiSwagger.Context;
using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

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
        public async Task<IEnumerable<MaterialRedeDropFilter>> ListaUnica(
            string uf, 
            string cdo, 
            string sigla,
            string estacao,
            bool semCdo,
            bool anoMesBool)
        {
            try
            {

                if(!string.IsNullOrEmpty(uf) || !string.IsNullOrEmpty(cdo) ||
                   !string.IsNullOrEmpty(sigla) || !string.IsNullOrEmpty(estacao)){

                        var query = (from endt in _context.EnderecosTotais
                        join mt in _context.MateriaisRedes on endt.Id_MaterialRede equals mt.Id_MaterialRede into joinedMateriais
                        from mt in joinedMateriais.DefaultIfEmpty()
                        where 
                        mt.SiglaFederativa_Mt == uf || endt.NomeCdo == cdo || mt.SiglaAbastecedora_Mt == sigla || mt.NomeAbastecedora_Mt == estacao || (semCdo ? endt.NomeCdo == "" : true)  && (anoMesBool ? !string.IsNullOrEmpty(endt.AnoMes) : true)   
                        group new { endt, mt } by new
                        {
                            mt.SiglaFederativa_Mt,
                            mt.SiglaAbastecedora_Mt,
                            mt.NomeAbastecedora_Mt,
                            endt.Cod_Viabilidade,
                            endt.Bairro,
                            endt.Municipio,
                            mt.GrupoOperacional_Mt,
                            mt.EstadoControle_Mt,
                            mt.EstadoOperacional_Mt
                        } into g
                        select new MaterialRedeDropFilter
                        {
                            UF = g.Key.SiglaFederativa_Mt,
                            SiglaEstacao = g.Key.SiglaAbastecedora_Mt,
                            NomeAbastecedora = g.Key.NomeAbastecedora_Mt,
                            Cod_Viabilidade = g.Key.Cod_Viabilidade,
                            Bairro = g.Key.Bairro,
                            Municipio = g.Key.Municipio,
                            GrupoOperacional = g.Key.GrupoOperacional_Mt,
                            EstadoControle = g.Key.EstadoControle_Mt,
                            EstadoOperacional = g.Key.EstadoOperacional_Mt
                            
                        }).ToListAsync();

                        return await query;

                }else{

                    var query =  (from endt in _context.EnderecosTotais
                    join mt in _context.MateriaisRedes on endt.Id_MaterialRede equals mt.Id_MaterialRede into joinedMateriais
                    from mt in joinedMateriais.DefaultIfEmpty()
                    where
                    (semCdo ? endt.NomeCdo == "" : true) && (anoMesBool ? !string.IsNullOrEmpty(endt.AnoMes) : true)
                    group new { endt, mt } by new
                    {
                        mt.SiglaFederativa_Mt,
                        endt.Cod_Viabilidade,
                        mt.GrupoOperacional_Mt,
                        mt.EstadoControle_Mt,
                        mt.EstadoOperacional_Mt

                    } into g
                    select new MaterialRedeDropFilter
                    {
                        UF = g.Key.SiglaFederativa_Mt,
                        Cod_Viabilidade = g.Key.Cod_Viabilidade,
                        GrupoOperacional = g.Key.GrupoOperacional_Mt,
                        EstadoControle = g.Key.EstadoControle_Mt,
                        EstadoOperacional = g.Key.EstadoOperacional_Mt
                        
                    }).ToListAsync();

                    return await query;

                }
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
        }
    }
}
