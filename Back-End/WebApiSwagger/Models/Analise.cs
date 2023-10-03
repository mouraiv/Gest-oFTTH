using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Analise
    {
        [Key]
        public int Id_Analise {get; set;}
        public string? Analista {get; set;}
        public string? Status {get; set;}
        public DateTime? DataAnalise {get; set;}
        public string? AnaliseObservacao {get; set;}
        public string? CDOIA {get; set;}
        public string? CDOIAStatus {get; set;}
        public string? CDOIAObs {get; set;}
        public int? Id_TesteOptico {get; set;}
        public TesteOptico? GetTesteOptico {get; set;}
    }
}