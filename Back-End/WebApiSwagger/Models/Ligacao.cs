using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Ligacao
    {
      [Key]
      public int Id_Ligacao { get; set; }
      public string? UF_ls { get; set; }
      public string? Municipio_ls { get; set; }
      public string? Localidade_ls { get; set; }
      public string? Projeto_ls { get; set; }
      public string? Celula_ls { get; set; }
      public string? CaboPrimario_ls { get; set; }
      public string? CaboSecundario_ls { get; set; }
      public string? Infraestrutura_ls { get; set; }
      public string? SiglaEstacao_ls { get; set; }
      public string? ICX_ls { get; set; }
      public string? NomeOlt_ls { get; set; }
      public string? PortaOlt_ls { get; set; }
      public string? BSP_ls { get; set; }
      public string? DGO_ls { get; set; }
      public string? FibraDgo_ls { get; set; }
      public string? CaboDgo_ls { get; set; }
      public string? SplitterCEOS_ls { get; set; }
      public string? OutSplitterCEOS_ls { get; set; }
      public string? CaboCdo_ls { get; set; }
      public string? FibraCdo_ls { get; set; }
      public string? PortaCdo_ls { get; set; }
      public string? SPLITTER_CDO { get; set; }
      public string? CDO_ls { get; set; }
      public string? EtiquetaPadrao_ls { get; set; }
      public string? ForaPadrao_ls { get; set; }
      public string? EtiquetaCampo_ls { get; set; }
      public string? IdentificacaoTerceiro_ls { get; set; }
      public string? EtiquetaTerceiro_ls { get; set; }
      public string? Rede_ls { get; set; }
      public string? Destinacao_ls { get; set; }
      public string? EstadoCicloVida_ls { get; set; }
      public int? Id_MaterialRede { get; set; }
      public MaterialRede MaterialRede { get; set; } = null!;
       
    }
}