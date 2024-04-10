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
                    .Include(p => p.EnderecoTotal)
                    .ThenInclude(p => p.ServicosAssociados)
                    .Include(p => p.Ligacao)
                        .FirstOrDefaultAsync(p => p.Id_MaterialRede == id_MaterialRede) ?? new MaterialRede();

                            /*await _context.Entry(query)
                                .Collection(p => p.Ligacao)
                                .LoadAsync();    

                            await _context.Entry(query)
                                .Collection(p => p.EnderecoTotal)
                                .LoadAsync();*/   
                                                                    
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
        public async Task<IEnumerable<EnderecoTotalDropListView>> ListaUnica(
            string uf, 
            string sigla,
            string estacao,
            string bairro,
            string municipio
            )
        {
            try
            {
                    var query = _context.DropEnderecosTotais.AsQueryable();

                    if (!string.IsNullOrEmpty(uf))
                    {
                        query = query.Where(endt => endt.UF == uf);
                    }

                    if (!string.IsNullOrEmpty(sigla))
                    {
                        query = query.Where(endt => endt.SiglaEstacao == sigla);
                    }

                    if (!string.IsNullOrEmpty(estacao))
                    {
                        query = query.Where(endt => endt.NomeAbastecedora == estacao);
                    }

                    if (!string.IsNullOrEmpty(bairro))
                    {
                        query = query.Where(endt => endt.Bairro == bairro);
                    }

                    if (!string.IsNullOrEmpty(municipio))
                    {
                        query = query.Where(endt => endt.Municipio == municipio);
                    }

                    var result = await query.Select(endt => new EnderecoTotalDropListView
                    {
                        UF = endt.UF,
                        SiglaEstacao = endt.SiglaEstacao,
                        NomeAbastecedora = endt.NomeAbastecedora,
                        Cod_Viabilidade = endt.Cod_Viabilidade,
                        Bairro = endt.Bairro,
                        Municipio = endt.Municipio,
                        GrupoOperacional = endt.GrupoOperacional,
                        EstadoControle = endt.EstadoControle,
                        EstadoOperacional = endt.EstadoOperacional

                    }).Distinct()
                    .ToListAsync();

                    return result;

            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao carregar: " + ex.Message);
            }
        }
    }
}
