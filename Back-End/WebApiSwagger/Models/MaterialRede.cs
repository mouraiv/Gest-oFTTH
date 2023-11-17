using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class MaterialRede
    {
      [Key]
      public int Id_MaterialRede { get; set; }
      public string? SiglaFederativa_Mt { get; set; }
      public string? NomeFederativa_Mt { get; set; }
      public string? Municipio_Mt { get; set; }
      public string? SiglaLocalidade_Mt { get; set; }
      public string? NomeLocalidade_Mt { get; set; }
      public string? NomeAbastecedora_Mt { get; set; }
      public string? SiglaAbastecedora_Mt { get; set; }
      public string? InfraestruturaRede_Mt { get; set; }
      public string? Codigo_Mt { get; set; }
      public string? ElementoRede_Mt { get; set; }
      public string? Tipo_Mt { get; set; }
      public string? Fabricante_Mt { get; set; }
      public string? Modelo_Mt { get; set; }
      public string? CodigoSap_Mt { get; set; }
      public string? EstadoOperacional_Mt { get; set; }
      public string? DataEstadoOperacional_Mt { get; set; }
      public string? Endereco_Mt { get; set; }
      public string? GrupoOperacional_Mt { get; set; }
      public string? EstadoControle_Mt { get; set; }
      public string? DataEstadoControle_Mt { get; set; }
      public string? Latitude_Mt { get; set; }
      public string? Longitude_Mt { get; set; }
      public string? CHAVE { get; set; }
      public Ligacao Ligacao { get; set; } = null!;
      public ICollection<EnderecoTotal> EnderecoTotal { get; set; } = new List<EnderecoTotal>();
       
    }
}