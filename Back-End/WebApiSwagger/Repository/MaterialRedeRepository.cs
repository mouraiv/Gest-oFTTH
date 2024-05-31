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
                var query = await _context.MateriaisRedesTeste
                    .Include(p => p.EnderecoTotal)
                    .ThenInclude(p => p.ServicosAssociados)
                    .Include(p => p.Ligacao)
                        .FirstOrDefaultAsync(p => p.Id_MaterialRede == id_MaterialRede) ?? new MaterialRede();

                return query;

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
                MaterialRede db = await CarregarId(id);

                _context.MateriaisRedesTeste.Remove(db);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)  
            {
                throw new Exception("Ocorreu um erro ao deletar: " + ex.Message);
            }
        }

        public async Task<MaterialRede> Editar(int id, MaterialRede materialRede)
        {
            try
            {
                MaterialRede db = await CarregarId(id);

                db.SiglaFederativa_Mt = materialRede.SiglaFederativa_Mt;
                db.NomeFederativa_Mt = materialRede.NomeFederativa_Mt;
                db.Municipio_Mt = materialRede.Municipio_Mt;
                db.SiglaLocalidade_Mt = materialRede.SiglaLocalidade_Mt;
                db.NomeLocalidade_Mt = materialRede.NomeLocalidade_Mt;
                db.NomeAbastecedora_Mt = materialRede.NomeAbastecedora_Mt;
                db.SiglaAbastecedora_Mt = materialRede.SiglaAbastecedora_Mt;
                db.InfraestruturaRede_Mt = materialRede.InfraestruturaRede_Mt;
                db.Codigo_Mt = materialRede.Codigo_Mt;
                db.ElementoRede_Mt = materialRede.ElementoRede_Mt;
                db.Tipo_Mt = materialRede.Tipo_Mt;
                db.Fabricante_Mt = materialRede.Fabricante_Mt;
                db.Modelo_Mt = materialRede.Modelo_Mt;
                db.CodigoSap_Mt = materialRede.CodigoSap_Mt;
                db.EstadoOperacional_Mt = materialRede.EstadoOperacional_Mt;
                db.DataEstadoOperacional_Mt = materialRede.DataEstadoOperacional_Mt;
                db.Endereco_Mt = materialRede.Endereco_Mt;
                db.GrupoOperacional_Mt = materialRede.GrupoOperacional_Mt;
                db.EstadoControle_Mt = materialRede.EstadoControle_Mt;
                db.DataEstadoControle_Mt = materialRede.DataEstadoControle_Mt;
                db.Latitude_Mt = materialRede.Latitude_Mt;
                db.Longitude_Mt = materialRede.Longitude_Mt;
                db.CHAVE = materialRede.CHAVE;
            
                _context.MateriaisRedesTeste.Update(db);
                await _context.SaveChangesAsync();

                return db;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao editar: " + ex.Message);
            }
        }

        public async Task<MaterialRede> Inserir(MaterialRede materialRede)
        {
            try
            {
                _context.MateriaisRedesTeste.Add(materialRede);
                await _context.SaveChangesAsync();
                return materialRede;    
            }
            catch (Exception ex)
            {  
                throw new Exception("Ocorreu um erro ao inserir: " + ex.Message);
            }
        }

        public async Task<MaterialRede> CarregarChave(string? chave)
        {
            try
            {
                return await _context.MateriaisRedesTeste
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
                    var query = _context.DropEnderecosTotais
                    .AsQueryable();

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

                    })
                    .Distinct()
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
