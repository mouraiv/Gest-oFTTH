using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class EnderecoTotal
    {
       [Key]
       public int Id_EnderecoTotal {get; set;}
       public string? Sigla {get; set;}
       public string? Unidade {get; set;} 
       public string? UF {get; set;}
       public string? Municipio {get; set;} 
       public string? Bairro {get; set;}
       public string? Logradouro {get; set;} 
       public string? CEP {get; set;}
       public string? CodSurvey {get; set;}
       public string? CDO {get; set;}
       public int? UMS {get; set;}
       public int? CodViabilidade {get; set;}
       public string? TipoViabilidade {get; set;}
       public string? TipoRede {get; set;}
       public string? DispComercial {get; set;}
       public decimal? Latitude {get; set;}
       public decimal? Longitude {get; set;}

       public int? Id_Ligacao {get; set;}
       public Ligacao GetLigacao {get; set;} = null!;          
    }
}