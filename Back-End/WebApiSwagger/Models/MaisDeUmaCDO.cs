using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class MaisDeUmaCDO
    {
      [Key]
      public int Id_MaisDeUmaCDO { get; set; }
      public string? UF { get; set; }
      public string? Estacao_Mc { get; set; }
      public string? Celula_Mc { get; set; }
      public string? Survey_Mc { get; set; }
      public string? Associacao_CDO { get; set; }
      public string? Nome_CDO { get; set; }
      public string? ChaveCelula { get; set; }
      public string? Data_de_associacao { get; set; }
      public int? Id_EnderecoTotal { get; set; }
      public EnderecoTotal EnderecosTotais { get; set; } = new EnderecoTotal(); 
      
    }
}