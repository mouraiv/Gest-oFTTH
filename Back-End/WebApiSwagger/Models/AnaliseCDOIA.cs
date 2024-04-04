using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class AnaliseCDOIA
    {
        [Key]
        public int Id_AnaliseCDOIA {get; set;}
        public string? CDOIA {get; set;}
        public string? CDOIAStatus {get; set;}
        public string? CDOIAObservacao {get; set;}
        public DateTime? DataAnalise {get; set;}
        public string? Analista {get; set;}
        public int? Id_Analise {get;set;}
        public int? Id_TesteOptico {get;set;}
    }
}