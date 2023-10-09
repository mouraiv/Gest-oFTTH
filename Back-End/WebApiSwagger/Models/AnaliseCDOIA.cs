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
        public int? Id_Analise {get;set;}
    }
}