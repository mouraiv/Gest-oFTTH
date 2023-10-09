using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class EnderecoTotal
    {
      [Key]
      public int Id_EnderecoTotal { get; set; }
      public string? UF { get; set; }
      public string? Estado { get; set; }
      public string? SiglaEstacao { get; set; }
      public string? Estacao { get; set; }
      public string? Celula { get; set; }
      public string? CaboPrimario { get; set; }
      public string? CaboSecundario { get; set; }
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
      public string? QuantidadeUMS { get; set; }
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
      public string? Quantidade_HCS { get; set; }
      public string? Projeto { get; set; }
      public string? EstadoOperacional { get; set; }
      public string? DataEstadoOperacional { get; set; }
      public string? EstadoControle { get; set; }
      public string? DataEstadoControle { get; set; }
      public string? EstadoProjeto { get; set; }
      public string? EstadoCicloVida { get; set; }
      public string? Rede { get; set; }
      public string? Destinacao { get; set; }
      public string? Id_Sicom { get; set; }
      public string? DcCre { get; set; }
      public string? InfraEstrutura { get; set; }
      public string? ICX { get; set; }
      public string? NomeOlt { get; set; }
      public string? PortaOLT { get; set; }
      public string? DGO { get; set; }
      public string? FibraDgo { get; set; }
      public string? CaboDgo { get; set; }
      public string? SplitterCeos { get; set; }
      public string? OutSplitterCeos { get; set; }
      public string? CaboCdo { get; set; }
      public string? FibraCdo { get; set; }
      public string? SplitterCdo { get; set; }
      public string? EtiquetaPadrao { get; set; }
      public string? ForaDePadrao { get; set; }
      public string? EtiquetaDeCampo { get; set; }
      public string? IndentificacaoTerceiro { get; set; }
      public string? EtiqueTerceiro { get; set; }
       
    }
}