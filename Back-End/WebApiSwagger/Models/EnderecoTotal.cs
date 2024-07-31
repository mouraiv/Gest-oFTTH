using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class EnderecoTotal
    {
      [Key]
      public int Id_EnderecoTotal { get; set; }
      public string? StatusGanho { get; set; } = null!;
      public int Id_StatusGanho { get; set; }
      public string? ChaveCelula { get; set; }
      public string? Disponibilidade { get; set; } = null!;
      public int Id_Disponibilidade { get; set; }
      public string? AnoMes { get; set; }
      public string? Celula { get; set; }
      public string? SiglaEstacao { get; set; }
      public string? UF { get; set; }
      public string? Municipio { get; set; }
      public string? Localidade { get; set; }
      public string? Cod_Localidade { get; set; }
      public string? LocalidadeAbrev { get; set; }
      public string? Logradouro { get; set; }
      public string? Cod_Logradouro { get; set; }
      public string? NumeroFachada { get; set; }
      public string? Complemento { get; set; }
      public string? ComplementoDois { get; set; }
      public string? ComplementoTres { get; set; }
      public string? CEP { get; set; }
      public string? Bairro { get; set; }
      public string? Cod_Survey { get; set; }
      public int? QuantidadeUMS { get; set; }
      public string? Cod_Viabilidade { get; set; }
      public string? TipoViabilidade { get; set; }
      public string? TipoRede { get; set; }
      public string? UCS_Residenciais { get; set; }
      public string? UCS_Comerciais { get; set; }
      public string? NomeCdo { get; set; }
      public string? Id_Endereco { get; set; }
      public string? Latitude { get; set; }
      public string? Longitude { get; set; }
      public string? TipoSurvey { get; set; }
      public string? RedeInterna { get; set; }
      public string? UMS_Certificadas { get; set; }
      public string? RedeEdificio_Certificados { get; set; }
      public string? NumeroPiso { get; set; }
      public string? Disp_Comercial { get; set; }
      public string? Id_Celula { get; set; }
      public string? EstadoControle { get; set; }
      public string? DataEstadoControle { get; set; }
      public string? DataAssociacao { get; set; }
      public string? Quantidade_HCS { get; set; }
      public string? Projeto { get; set; }
      public string? Id_Associacao { get; set; }
      public int? Id_MaterialRede { get; set; }
      public MaterialRede MaterialRede { get; set;} = null!;
      public ICollection<ServicoAssociado> ServicosAssociados { get; set; } = new List<ServicoAssociado>();
       
    }
}